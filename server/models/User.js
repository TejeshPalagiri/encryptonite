const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/config");
const cryptoService = require("../services/crypto.service");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide user name"],
  },
  email: {
    type: String,
    require: [true, "Please provide email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: [true, "User with email already exists"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    select: false,
  },
  salt: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Please provide user status"],
    enum: {
      values: ["INVITE", "ACTIVE", "INACTIVE"],
      message: "Please use user Status only from INVITE, ACTIVE, INACTIVE",
    },
    default: "ACTIVE",
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordExpiry: {
    type: Date,
  },
});

// Encrypting password before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // TODO: Password changed here update all the saved password before updating users password decrypt with old password and encrypt with new password
  console.log("Changin password");
  this.salt = crypto.randomBytes(16).toString("base64");
  this.password = this.encryptPassword(this.password);

  next();
});

userSchema.methods.getTokens = function () {
  let accessToken = jwt.sign(
    {
      user_id: cryptoService.encrypt(this._id.toString()),
      email: cryptoService.encrypt(this.email),
      status: cryptoService.encrypt(this.status),
    },
    config.JWT_AUTH_SECRET,
    {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY,
    }
  );
  let refreshToken = jwt.sign(
    {
      user_id: cryptoService.encrypt(this._id.toString()),
      email: cryptoService.encrypt(this.email),
      status: cryptoService.encrypt(this.status),
    },
    config.JWT_AUTH_SECRET,
    {
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRY,
    }
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};

// ENCRYPTING PASSWORD
const encryptPassword = function (password) {
  if (!password || !this.salt) {
    return "";
  }
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("base64");
};

userSchema.methods.encryptPassword = encryptPassword;

// Compare password function
userSchema.methods.comparePassword = function (password) {
  return this.encryptPassword(password) === this.password;
};

userSchema.methods.getForgotPasswordToken = function () {
  let token = cryptoService.encrypt(this._id.toString());
  this.forgotPasswordToken = token;
  this.forgotPasswordExpiry = Date.now() + 30 * 60 * 1000;
  return token;
};

module.exports = mongoose.model("User", userSchema);
