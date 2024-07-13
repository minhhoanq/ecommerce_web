import * as redis from "redis";

const redisClient = redis.createClient();

redisClient.connect().then(() => {
    console.log("Redis connection successfully!");
});

export default redisClient;
