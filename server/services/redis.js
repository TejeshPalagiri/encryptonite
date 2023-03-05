const redisService = require("../config/database/redis");

const saveUserRefreshToken = (userId, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await redisService.client.SADD(
        userId.toString(),
        refreshToken
      );
      resolve(null);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserRefreshToken = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userTokens = await redisService.client.SMEMBERS(userId.toString());
      resolve(userTokens);
    } catch (error) {
      reject(error);
    }
  });
};

const removeUserRefreshToken = (userId, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let removedResult = await redisService.client.SREM(
        userId.toString(),
        refreshToken
      );
      resolve(removedResult);
    } catch (error) {
      reject(error);
    }
  });
};

const removeAllSessions = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let removedResult = await redisService.client.del(userId);
      resolve(removedResult);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  saveUserRefreshToken,
  getUserRefreshToken,
  removeUserRefreshToken,
  removeAllSessions
};
