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
        const cartItem: any[] = await this._prisma.$queryRaw`
            SELECT * FROM "cartitems"
            WHERE "cartId" = ${cartId}
        `;
        return cartItem.length > 0 ? cartItem[0] : null;
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
                "quantity"= ${quantity},
                "updatedAt"=${updatedAt}
            WHERE "cartId" = ${cartId} AND "productItemId" = ${productItemId}
        `;
    }

    async updateQty(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any> {
        const { cartId, productItemId, quantity } = payload;
        const updatedAt = new Date();

        return await this._prisma.$queryRaw`
            UPDATE "cartitems"
            SET 
                "quantity"= "quantity" + ${quantity},
                "updatedAt"=${updatedAt}
            WHERE "cartId" = ${cartId} AND "productItemId" = ${productItemId}
        `;
    }

    async delete(userId: number, productItemId: number): Promise<any> {
        return await this._prisma.$executeRaw`
            DELETE FROM cartitems
            USING carts
            WHERE carts.id = cartitems."cartId"
            AND carts."userId" = ${userId}
            AND cartitems."productItemId" = ${productItemId}
        `;
    }

    async findByUserId(userId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT p."name", sm."salePrice", ci."quantity" FROM cartitems as ci
            JOIN smartphones as sm on ci."productItemId" = sm.id
            JOIN products as p on sm."productId" = p.id
            JOIN carts as c on ci."cartId" = c.id
            JOIN users as u on c."userId" = u.id
            WHERE u."id" = ${userId}
        `;
    }
}
