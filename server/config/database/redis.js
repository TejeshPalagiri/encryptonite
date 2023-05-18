const redis = require("redis");
let client;

if(process.env.NODE_ENV == "production") {
  console.log(process.env.REDIS_PASSWORD)
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  })
} else {
  client = redis.createClient({});
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
