import { PrismaClient } from "@prisma/client";
import { IInventoryRepository } from "../../domain/repositories/inventory.inteface";
import "reflect-metadata";
import { injectable } from "inversify";
import {
    JsonArray,
    JsonObject,
    JsonValue,
} from "@prisma/client/runtime/library";

@injectable()
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
            throw new Error(
                "Đã có sự thay đổi, vui lòng quay lại giỏ hàng để kiểm tra!"
            );
        }

        let currentReservations: JsonArray = [];
        if (Array.isArray(inventoryItem.reservations)) {
            currentReservations = inventoryItem.reservations as JsonArray;
        }

        // Tạo bản ghi đặt hàng mới
        const newReservation: JsonObject = {
            userId,
            quantity,
            createdAt: new Date().toISOString(),
        };

        // Cập nhật tồn kho và reservations
        const updateInventory = await this._prisma.inventory.update({
            where: { id: inventoryItem.id }, // Sử dụng id duy nhất
            data: {
                stock: {
                    decrement: quantity,
                },
                reservations: [...currentReservations, newReservation],
            },
        });

        return updateInventory;
    }
}
