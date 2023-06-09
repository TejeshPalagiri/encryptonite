const redis = require("redis");
let client;

console.log("Connecting to Redis", process.env.REDIS_HOST, process.env.REDIS_HOST, process.env.REDIS_PORT)
// if(process.env.NODE_ENV == "production") {
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })
// } else {
//   client = redis.createClient({});
// }
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
