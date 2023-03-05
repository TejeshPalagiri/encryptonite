const User = require("../services/user.service");
const cookieToken = require("../utils/cookie-token");
const _ = require("lodash");
const validator = require("validator");
const mongoose = require("mongoose");
const {
  removeUserRefreshToken,
  removeAllSessions,
} = require("../services/redis");

const sigup = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    if (!email || !name || !password) {
      let error = new Error("Please provied name, email and password");
      error.status = 400;
      throw error;
    }
    if (!validator.isEmail(email)) {
      let error = new Error("Please provied a valid email address");
      error.status = 400;
      throw error;
    }

    if (password.length < 8) {
      let error = new Error("Password should be atleast 8 characters");
      error.status = 400;
      throw error;
    }

    let user = await User.findUserByEmail(email);

    if (!_.isEmpty(user)) {
      let error = new Error("User with given email already exists");
      error.status = 400;
      throw error;
    }

    user = await User.registerUser(req.body);

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      let error = new Error("Please provied email and password");
      error.status = 400;
      throw error;
    }
    if (!validator.isEmail(email)) {
      let error = new Error("Please provied a valid email address");
      error.status = 400;
      throw error;
    }

    let user = await User.findUserByEmail(email);

    if (_.isEmpty(user)) {
      let error = new Error("Invalid Credentials.");
      error.status = 400;
      throw error;
    }

    if (user.comparePassword(password) == false) {
      let error = new Error("Invalid Credentials.");
      error.status = 400;
      throw error;
    }

    cookieToken(user, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getCurrentUserDetails = async (req, res, next) => {
  try {
    let user = await User.findUserById(req.user.user_id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    let refreshToken =
      req.headers["x-header-refreshtoken"] || req.cookies.accessToken;

    if (!refreshToken) {
      let error = new Error("Un Authorized access.");
      error.status = 400;
      throw error;
    }
    await removeUserRefreshToken(req.user.user_id, refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "User loggedout successfully.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logoutAllSessions = async (req, res, next) => {
  try {
    let result = await removeAllSessions(req.user.user_id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "User loggedout successfully, From all the devices",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { user_id } = req.user;
    let { password } = req.body;

    if (!password) {
      let error = new Error("Please provide password");
      error.status = 400;
      throw error;
    }
    if (password.length < 8) {
      let error = new Error("Password should be atleast 8 characters");
      error.status = 400;
      throw error;
    }
    let result = await User.changePassword(user_id, password);
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = {
  sigup,
  login,
  getCurrentUserDetails,
  logout,
  logoutAllSessions,
  changePassword,
};
