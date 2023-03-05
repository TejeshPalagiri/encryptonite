const jwtService = require("../services/jwt.service");
const User = require("../models/User");
const redis = require("../services/redis");
const { decrypt } = require("../services/crypto.service");
const _ = require("lodash");
const cookieToken = require("../utils/cookie-token");

const isLoggedIn = async (req, res, next) => {
  try {
    let accessToken =
      req.headers["x-header-authtoken"] || req.cookies.accessToken;
    let refreshToken =
      req.headers["x-header-refreshtoken"] || req.cookies.refreshToken;
    if (!accessToken) {
      let error = new Error("Un-Autorized Access. Please login again");
      error.status = 401;
      return next(error);
    }

    try {
      let accessTokenData = await jwtService.verifyToken(accessToken);
      let { user_id, email, status } = accessTokenData;

      req.user = accessTokenData;
      req.user = {
        user_id: decrypt(user_id),
        email: decrypt(email),
        status: decrypt(status),
      };
      return next();
    } catch (error) {
      // First check refresh toiken avaiablity
      if (!refreshToken) {
        let error = new Error("Un-Autorized Access. Please login again");
        error.status = 401;
        return next(error);
      }
      await checkRefreshToken(refreshToken);
      // if accesstoken got expired update the accesstoken
      if (error.name == "TokenExpiredError") {
        let accessToken =
          req.headers["x-header-authtoken"] || req.cookies.accessToken;
        const payload = await jwtService.getDetailsFromToken(accessToken);
        const userId = decrypt(payload.user_id);
        const user = await User.findById(userId);
        const tokens = user.getTokens();
        await redis.removeUserRefreshToken(userId, refreshToken);
        await redis.saveUserRefreshToken(userId, tokens.refreshToken);

        if (req?.path == "/logout") {
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
          return res.status(200).json({
            success: true,
            message: "User Logged out successfully",
          });
        }

        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
        });
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
        });
        return res.status(401).json({
          message:
            "Access token got expired please use the latest access token.",
          name: "AccessTokenExpiredError",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      }
    }
  } catch (err) {
    console.error(err);
    if (err.name == "TokenExpiredError") {
      let refreshToken =
        req.headers["x-header-refreshtoken"] || req.cookies.refreshToken;
      const payload = await jwtService.getDetailsFromToken(refreshToken);
      const userId = decrypt(payload.userId);
      await removeUserRefreshToken(userId, refreshToken);
    }
    let error = new Error("Session expired. Please login again");
    error.status = 401;
    next(error);
  }
};

const checkRefreshToken = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tokenData = await jwtService.verifyToken(refreshToken);
      let userId = decrypt(tokenData.user_id);
      let tokensInRedis = await redis.getUserRefreshToken(userId);
      if (_.indexOf(tokensInRedis, refreshToken) == -1) {
        reject("Token Expired. Please login again.");
      } else {
        resolve(tokenData);
      }
      resolve(tokenData);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  isLoggedIn: isLoggedIn,
};
