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
        console.log({ productItemId, quantity, userId });

        const inventoryItem = await this._prisma.inventory.findFirst({
            where: {
                skuId: productItemId,
                stock: {
                    gte: quantity,
                },
            },
        });

        if (!inventoryItem) {
            throw new Error("Not enough stock or item not found");
        }

        const update = {
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
            where: { id: inventoryItem.id }, // Use unique identifier
            data: update,
        });

        return updateInventory;
    }
}
