require("dotenv").config();
require("./config/database/mongo");
require("./config/database/redis").connectRedis();
const path = require('path');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const v1 = require("./routes/v1");
const cookieParser = require("cookie-parser");
const { version } = require("./config/config");

const port = process.env.PORT || 4000;
const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../encryptonite-public/dist')));

app.use('/', express.static('../encryptonite-public/dist'))

app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Hey Welcome to encryptonite. Currently running the server on version" + version,
  });
});
app.use("/api/v1", v1);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // error message
  const response =
    req.app.get("env") === "dev"
      ? {
          success: false,
          message: err.message,
          code: err.code ? err.code : "",
          stack: err.stack,
        }
      : {
          success: false,
          message: err.message,
          status: err.status || 500,
          code: err.code ? err.code : "",
        };

  // send error message
  res.status(err.status || 500);
  res.send(response);
});

app.listen(port, () => {
  console.info(`App started listening on: http://localhost:${port}`);
});
