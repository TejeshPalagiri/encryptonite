const mongoose = require("mongoose");
const config = require("../config");

const connectionUri = config.MONGODB_URI;

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", () => {
  console.log(`Mongo Connected`);
});

mongoose.set("debug", true);

/** On Mongo connection error */
mongoose.connection.on("error", (error) => {
  console.log(`Error in connecting MongoDB. ${error}`);
  setTimeout(function () {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(connectionUri);
    }
  }, 1000);
});

/** On Mongo disconnect */
mongoose.connection.on("disconnected", (error) => {
  // Retrying to connect to mongo db of disconnected
  console.log("Mongo got disconnected retrying to connect.");
  setTimeout(function () {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(connectionUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  }, 1000);
});

/* If the Node process ends, close the Mongoose connection **/
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
