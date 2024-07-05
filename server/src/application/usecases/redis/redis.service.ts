import { promisify } from "util";
import redisClient from "../../../infrastructure/redis";

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (
    productId: number,
    quantity: number,
    cartId: number
) => {
    const key = `lock_v2024_${productId}`;
    const retryTimes = 10;
    const exprireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        //Tao 1 key de nam giu thanh toan
        const result = await setnxAsync(key, exprireTime);
        console.log(result);
        if (result === 1) {
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock: string) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

export { acquireLock, releaseLock };
