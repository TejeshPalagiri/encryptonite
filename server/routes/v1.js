const router = require("express").Router();
const middlewares = require("../middlewares/authenticator");
const user = require("../controllers/user.controller");
const credentials = require("../controllers/credentials.controller");
const { version } = require("../config/config")

// Dummy route
router.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Hey Welcome to encryptonite. Currently running the server on version" + version,
  });
});

// User realated routes
router.post("/user", user.sigup);
router.get("/user", middlewares.isLoggedIn, user.getCurrentUserDetails);
router.put("/user/password", middlewares.isLoggedIn, user.changePassword);

// login
router.post("/login", user.login);
router.delete("/logout", middlewares.isLoggedIn, user.logout);
router.delete("/logout/everywhere", middlewares.isLoggedIn, user.logoutAllSessions)

// Credentials
router.post("/credentials", middlewares.isLoggedIn, credentials.createCredentials)
router.get("/credentials", middlewares.isLoggedIn, credentials.getAllCredentials)
router.get("/credentials/:_id", middlewares.isLoggedIn, credentials.getCredentialsById)
router.put("/credentials/:_id", middlewares.isLoggedIn, credentials.updateCredentials)
router.get("/password/:_id", middlewares.isLoggedIn, credentials.retrievePlainPassword)


module.exports = router;
