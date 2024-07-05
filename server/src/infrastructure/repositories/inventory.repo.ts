import { PrismaClient } from "@prisma/client";
import { IInventoryRepository } from "../../domain/repositories/inventory.inteface";

export class InventoryRepositoryImpl implements IInventoryRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async revervation(
        productItemId: number,
        quantity: number,
        userId: number
    ): Promise<any> {
        const query: any = {
                skuId: productItemId,
                stock: {
                    gte: quantity,
                },
            },
            update = {
                stock: {
                    decrement: quantity,
                },
                reservations: {
                    userId,
                    quantity,
                    createdAt: new Date(),
                },
            };
        const updateInventory = await this._prisma.inventory.update({
            where: query,
            data: update,
        });

        return updateInventory;
    }
}
