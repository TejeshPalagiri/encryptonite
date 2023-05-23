const Credentials = require("../models/Credentials");
const _ = require("lodash");
const mongoose = require("mongoose");

const getAllCredentials = async (userId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { page, search } = req.params;
      let skip = 0;
      let limit = 100;
      if (_.isEmpty(page)) {
        page = 1;
      }
      skip = (page - 1) * limit;
      let credentials;

      let project = {
        name: 1,
        user_name: 1,
        updated_at: 1,
        domain_url: 1,
        last_accessed_at: 1,
        status: 1
      };
      if (!_.isEmpty(req)) {
        if (!_.isEmpty(search)) {
          credentials = await Credentials.find(
            {
              created_by: userId,
              is_deleted: false,
              $or: [
                {
                  name: { $regex: search, $options: "i" },
                  user_name: { $regex: search, $options: "i" },
                  domain_url: { $regex: search, $options: "i" },
                },
              ],
            },
            project
          )
            .skip(skip)
            .limit(limit);
        } else {
          credentials = await Credentials.find({ created_by: userId, is_deleted: false }, project)
            .skip(skip)
            .limit(limit);
        }
      } else {
        credentials = await Credentials.find({ created_by: userId }, project);
      }

      resolve(credentials);
    } catch (error) {
      reject(error);
    }
  });
};

const getCredentialsById = async (userId, _id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await Credentials.findOne(
        {
          _id: _id,
          created_by: userId,
        },
        {
          name: 1,
          user_name: 1,
          updated_at: 1,
          domain_url: 1,
          status: 1,
          last_accessed_at: 1
        }
      );
      resolve(credentials);
    } catch (error) {
      reject(error);
    }
  });
};

const createCredentials = async (userId, masterPassword, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = new Credentials({
        name: payload.name,
        domain_url: payload.domain_url,
        password: payload.password,
        user_name: payload.user_name,
        created_by: userId,
        updated_by: userId,
      });
      credentials.encryptPassword(masterPassword);
      await credentials.save();
      resolve(credentials);
    } catch (error) {
      reject(error);
    }
  });
};

const updateCredentials = async (userId, masterPassword, payload, _id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await Credentials.findById(_id);
      if (_.isEmpty(credentials)) {
        let error = new Error("No Credentials found with given Id");
        error.status = 400;
        throw error;
      }
      _.forEach(payload, (value, key) => {
        if (key == "password") {
          if(value && value.length) {
            credentials.password = value;
            credentials.encryptPassword(masterPassword);
          }
        } else {
          credentials[`${key}`] = value;
        }
      });
      credentials.updated_at = Date.now();
      credentials.updated_by = userId;
      console.log("updatede credeential", credentials)
      await credentials.save();
      resolve(credentials);
    } catch (error) {
      reject(error);
    }
  });
};

const retrievePlainPassword = async (userId, _id, masterPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await Credentials.findOne({
        _id: _id,
        created_by: userId,
      });
      let password = credentials.decryptPassword(masterPassword);
      credentials.retrieved_count += 1;
      credentials.last_accessed_at = Date.now();
      await credentials.save();

      resolve(password);
    } catch (error) {
      reject(error);
    }
  });
};

const bulkUpdateCredentials = async (
  userId,
  oldMasterPassword,
  newMasterPassword
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await Credentials.find({ created_by: userId });
      let promises = [];
      _.forEach(credentials, (cred) => {
        const plainPassword = cred.decryptPassword(oldMasterPassword);
        cred.password = plainPassword;
        cred.updated_at = Date.now();
        cred.updated_by = userId;
        cred.encryptPassword(newMasterPassword);
        promises.push(cred.save());
      });
      let result = await Promise.all(promises);
      resolve(result);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const deleteCredential = async (
  userId,
  _id
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await Credentials.findById({ _id: _id });
      credentials.is_deleted = true;
      credentials.updated_by = userId;
      await credentials.save();
      resolve(credentials);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};


module.exports = {
  getAllCredentials,
  getCredentialsById,
  createCredentials,
  updateCredentials,
  retrievePlainPassword,
  bulkUpdateCredentials,
  deleteCredential
};
