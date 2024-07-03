import { injectable } from "inversify";
import "reflect-metadata";
import { ICartRepository } from "../../domain/repositories/cart.interface";
import { PrismaClient } from "@prisma/client";

@injectable()
export class CartRepositoryImpl implements ICartRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async findByUserId(userId: number): Promise<any> {
        console.log("Cjcek find", userId);
        const cart: any[] = await this._prisma.$queryRaw`
            SELECT id FROM "carts"
            WHERE "userId" = ${userId}
        `;
        return cart.length > 0 ? cart[0] : null;
    }

    async create(userId: number): Promise<any> {
        const updatedAt = new Date();
        const cart: any[] = await this._prisma.$queryRaw`
            INSERT INTO carts (
                "userId",
                "updatedAt"
            ) VALUES (${userId}, ${updatedAt})
            RETURNING *
        `;
        return cart.length > 0 ? cart[0] : null;
    }
}
