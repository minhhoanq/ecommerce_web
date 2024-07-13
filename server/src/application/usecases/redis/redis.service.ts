import { promisify } from "util";
import redisClient from "../../../infrastructure/redis";
import { InventoryRepositoryImpl } from "../../../infrastructure/repositories/inventory.repo";

// const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const invenRepo = new InventoryRepositoryImpl();

const acquireLock = async (
    productItemId: number,
    quantity: number,
    userId: number
) => {
    const key = `lock_v2024_${productItemId}`;
    const retryTimes = 10;
    const exprireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        //Tao 1 key de nam giu thanh toan
        const result = await redisClient.setNX(key, exprireTime.toString());
        console.log("result", result);
        if (result === true) {
            // Thay doi thoi gian xac nhan
            const isRevervation = await invenRepo.revervation(
                productItemId,
                quantity,
                userId
            );
            console.log(isRevervation);
            if (isRevervation) {
                await redisClient.pExpire(key, exprireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock: string) => {
    // const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await redisClient.del(keyLock);
};

export { acquireLock, releaseLock };
