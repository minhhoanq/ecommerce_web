import { injectable } from "inversify";
import { IOrderRepository } from "../../domain/repositories/order.interface";
import { PrismaClient } from "@prisma/client";

@injectable()
export class OrderRepositoryImpl implements IOrderRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async create(
        userId: number,
        paymentMethodId: number,
        addressId: number,
        total: number,
        payload: [
            {
                id: number;
                quantity: number;
                salePrice: number;
            }
        ]
    ): Promise<any> {
        console.log(payload);

        try {
            const dateNow = new Date();
            return await this._prisma.$transaction(async (prisma) => {
                const order: any[] = await prisma.$queryRaw`
                    INSERT INTO orders (
                        "userId",
                        "paymentMethodId",
                        "addressId",
                        "dateOrder",
                        "total",
                        "updatedAt"
                    ) VALUES (${userId}, ${paymentMethodId}, ${addressId}, ${dateNow}, ${total}, ${dateNow})
                    RETURNING *
                `;

                console.log(order);

                const orderItems = payload.map(
                    async (el: {
                        id: number;
                        quantity: number;
                        salePrice: number;
                    }) => {
                        await prisma.$executeRaw`
                            INSERT INTO orderitems (
                                "orderId",
                                "skuId",
                                "quantity",
                                "price",
                                "updatedAt"
                            ) VALUES (${order[0].id}, ${el.id}, ${el.quantity}, ${el.salePrice}, ${dateNow})
                        `;
                    }
                );

                await Promise.all(orderItems);
                return order.length > 0 ? order[0] : null;
            });
        } catch (error) {
            throw error;
        } finally {
            await this._prisma.$disconnect();
        }
    }

    async findFirst(userId: number, orderId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT oi.id, u."username", u."phone", o."paymentMethodId", o."total", p."name" as "productName", sk."attributes", oi."quantity", oi."price" FROM users as u
            JOIN orders as o on u.id = o."userId"
            JOIN orderitems as oi on o.id = oi."orderId"
            JOIN skus as sk on oi."skuId" = sk.id
            JOIN products as p on sk."productId" = p.id
            WHERE o.id = ${orderId} AND o."userId" = ${userId}
        `;
    }

    async findMany(userId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT * FROM orders as o
            JOIN orderitems as oi on oi."orderId" = o.id
            WHERE o."userId" = ${userId}
        `;
    }
}
