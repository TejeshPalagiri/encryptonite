const redis = require("redis");
const config = require("../config");
let client;

  client = redis.createClient({
    socket: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT
    }
  })

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
