const Credentials = require("../services/credentials.service");
const User = require("../services/user.service");

const getAllCredentials = async (req, res, next) => {
  try {
    let userId = req.user.user_id;
    let credentials = await Credentials.getAllCredentials(userId, req);

    res.status(200).json({
      sccuess: true,
      data: credentials,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getCredentialsById = async (req, res, next) => {
  try {
    let userId = req.user.user_id;
    let { _id } = req.params;
    let credentials = await Credentials.getCredentialsById(userId, _id);

    res.status(200).json({
      sccuess: true,
      data: credentials,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createCredentials = async (req, res, next) => {
  try {
    let userId = req.user.user_id;
    let { name, domain_url, password, user_name } = req.body;
    if (!name || !domain_url || !password || !user_name) {
      let error = new Error(
        "Please provide, name, username, domain and password"
      );
      error.status = 400;
      throw error;
    }
    domain_url = domain_url.toLoweCase();
    let masterPassword = await User.getUserHashedPassword(userId);
    let credentials = await Credentials.createCredentials(
      userId,
      masterPassword,
      req.body
    );

    res.status(200).json({
      sccuess: true,
      data: credentials,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateCredentials = async (req, res, next) => {
  try {
    let userId = req.user.user_id;
    let { _id } = req.params;
    let { name, domain_url, password, user_name } = req.body;
    if (!name || !domain_url || !user_name) {
      let error = new Error(
        "Please provide, name, username, domain and password"
      );
      error.status = 400;
      throw error;
    }
    let masterPassword = await User.getUserHashedPassword(userId);
    let credentials = await Credentials.updateCredentials(
      userId,
      masterPassword,
      req.body,
      _id
    );

    res.status(200).json({
      sccuess: true,
      data: credentials,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const retrievePlainPassword = async (req, res, next) => {
  try {
    let userId = req.user.user_id;

    let masterPassword = await User.getUserHashedPassword(userId);
    let { _id } = req.params;
    let password = await Credentials.retrievePlainPassword(
      userId,
      _id,
      masterPassword
    );

    res.status(200).json({
      sccuess: true,
      data: password,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllCredentials,
  getCredentialsById,
  createCredentials,
  updateCredentials,
  retrievePlainPassword,
};
