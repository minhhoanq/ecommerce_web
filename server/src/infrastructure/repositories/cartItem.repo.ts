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
                "skuId",
                "quantity",
                "updatedAt"
            ) VALUES (
                ${cartId},
                ${productItemId},
                ${quantity},
                ${updatedAt}
            )
            RETURNING *
        `;
    }

    async findByCartId(cartId: number): Promise<any> {
        const cartItem: any[] = await this._prisma.$queryRaw`
            SELECT * FROM "cartitems"
            WHERE "cartId" = ${cartId}
        `;
        return cartItem;
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
            WHERE "cartId" = ${cartId} AND "skuId" = ${productItemId}
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
            WHERE "cartId" = ${cartId} AND "skuId" = ${productItemId}
        `;
    }

    async delete(userId: number, productItemId: number): Promise<any> {
        return await this._prisma.$executeRaw`
            DELETE FROM cartitems
            USING carts
            WHERE carts.id = cartitems."cartId"
            AND carts."userId" = ${userId}
            AND cartitems."skuId" = ${productItemId}
        `;
    }

    async findByUserId(userId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT sk.id, p."name", pr."price", ci."quantity", sk."attributes" FROM cartitems as ci
            JOIN skus as sk on ci."skuId" = sk.id
            JOIN prices as pr on sk.id = pr."skuId"
            JOIN products as p on sk."productId" = p.id
            JOIN carts as c on ci."cartId" = c.id
            JOIN users as u on c."userId" = u.id
            WHERE u."id" = ${userId}
        `;
    }
}
