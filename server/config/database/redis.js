const redis = require("redis");
const config = require("../config");
let client;

if(process.env.ENVIRONMENT == "production") {

  client = redis.createClient({
    socket: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT
    },
    username: config.REDIS_USER,
    password: config.REDIS_PASSWORD
  })
} else {
  client = redis.createClient();
}

module.exports = {
  client: client,
  connectRedis: async () => {
    try {
      await client.connect();
      console.log(`Redis Connected`);
    } catch (error) {
      console.error(`Error while connecting to redis: ${error}`);
      process.exit(0);
    }
  },
};
