const User = require("../models/User");
const { bulkUpdateCredentials } = require("../services/credentials.service");

const registerUser = async (userDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newUser = new User({
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
      });
      await newUser.save();
      resolve(newUser);
    } catch (error) {
      reject(error);
    }
  });
};

const findUserByEmail = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ email: email }).select("+password");
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const findUserById = async (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findById(_id);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserHashedPassword = async (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findById(_id).select("+password");
      resolve(user.password);
    } catch (error) {
      reject(error);
    }
  });
};

const changePassword = async (_id, newpassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findById(_id).select("+password");
      let oldMasterPassword = user.password;
      user.password = newpassword;
      await user.save();
      let newMasterPassword = user.password;

      let result = await bulkUpdateCredentials(
        _id,
        oldMasterPassword,
        newMasterPassword
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

// export const findUserByEmailOrUserId = async (text) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let user = await User.findOne({ email: email });
//             resolve(user)
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
module.exports = {
  registerUser,
  findUserByEmail,
  findUserById,
  getUserHashedPassword,
  changePassword,
};
