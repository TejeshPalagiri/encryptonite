const redis = require("../services/redis");

const cookieToken = async (user, res, refreshToken) => {
  if (refreshToken) {
    await redis.removeUserRefreshToken(user._id, refreshToken);
  }
  const tokens = user.getTokens();
  await redis.saveUserRefreshToken(user._id, tokens.refreshToken);
  const options = {
    httpOnly: true,
  };

  user.salt = undefined;
  user.password = undefined;

  res.cookie("refreshToken", tokens.refreshToken);
  res.cookie("accessToken", tokens.accessToken);

  res.status(200).json({
    success: true,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user,
  });
};

module.exports = cookieToken;
