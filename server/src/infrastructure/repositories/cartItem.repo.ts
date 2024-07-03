import { injectable } from "inversify";
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { ICartItemRepository } from "../../domain/repositories/cartItem.interface";

@injectable()
export class CartItemRepositoryImpl implements ICartItemRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async create(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any> {
        const { cartId, productItemId, quantity } = payload;
        const updatedAt = new Date();
        return await this._prisma.$queryRaw`
            INSERT INTO cartitems (
                "cartId",
                "productItemId",
                "quantity",
                "updatedAt"
            ) VALUES (
                ${cartId},
                ${productItemId},
                ${quantity},
                ${updatedAt}
            )
        `;
    }

    async findByCartId(cartId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT * FROM "cartitems"
            WHERE "cartId" = ${cartId}
        `;
    }

    async update(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any> {
        const { cartId, productItemId, quantity } = payload;
        const updatedAt = new Date();

        return await this._prisma.$queryRaw`
            UPDATE "cartitems"
            SET 
                "quantity"=${quantity},
                "updatedAt"=${updatedAt}
            WHERE "cartId" = ${cartId} AND "productItemId" = ${productItemId}
        `;
    }
}
