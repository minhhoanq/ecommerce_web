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
                    async (el: { id: number; quantity: number }) => {
                        await prisma.$executeRaw`
                            INSERT INTO orderitems (
                                "orderId",
                                "skuId",
                                "quantity",
                                "updatedAt"
                            ) VALUES (${order[0].id}, ${el.id}, ${el.quantity}, ${dateNow})
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

    async updateStatus(userId: number, orderId: number): Promise<any> {
        return await this._prisma.order.update({
            where: {
                userId,
                id: orderId,
            },
            data: {
                orderStatusId: 2,
            },
        });
    }

    async delete(userId: number, orderId: number): Promise<any> {
        return await this._prisma.order.delete({
            where: {
                userId,
                id: orderId,
            },
        });
    }

    async findFirst(userId: number, orderId: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT 
                oi.id, u."username", u."phone", o."paymentMethodId", 
                o."total", p."name" as "productName", sk."attributes", 
                oi."quantity", pr."price" 
            FROM users as u
            JOIN orders as o on u.id = o."userId"
            JOIN orderitems as oi on o.id = oi."orderId"
            JOIN skus as sk on oi."skuId" = sk.id
            JOIN prices as pr on sk.id = pr."skuId"
            JOIN products as p on sk."productId" = p.id
            WHERE o.id = ${orderId} AND o."userId" = ${userId}
        `;
    }

    async findMany(userId: number): Promise<any> {
        const orders: any[] = await this._prisma.$queryRaw`
            SELECT o.id AS "orderId", o."userId", o."total", o."paymentMethodId", o."orderStatusId", o."createdAt", o."updatedAt",
            json_agg(
                    json_build_object(
                        'id', oi.id,
                        'orderId', oi."orderId",
                        'productName', p."name",
                        'slug', sk."slug",
                        'attributes', sk."attributes",
                        'quantity', oi."quantity",
                        'price', pr."price",
                        'createdAt', oi."createdAt",
                        'updatedAt', oi."updatedAt"
                    )
                ) AS orderitems
            FROM
                orders o
            JOIN
                orderitems oi ON o.id = oi."orderId"
            JOIN skus sk on oi."skuId" = sk.id
            JOIN prices as pr on sk.id = pr."skuId"
            JOIN products p ON sk."productId" = p.id
            WHERE
                o."userId" = ${userId}
            GROUP BY
                o.id
            ORDER BY o."createdAt" DESC
            LIMIT 7
            `;

        return orders;
    }

    async findFirstOrderItem(orderItemId: number): Promise<any> {
        const orderItem: any[] = await this._prisma.$queryRaw`
            SELECT * FROM orderitems as oi
            WHERE oi.id = ${orderItemId}
        `;

        return orderItem.length > 0 ? orderItem[0] : null;
    }

    async getStatistical(): Promise<any> {
        const countNewUser: any[] = await this._prisma.$queryRaw`
            SELECT COUNT(*) FROM users
            WHERE "roleId" = 2;
        `;

        const paid: any[] = await this._prisma.$queryRaw`
            select sum("total") from orders
            where "orderStatusId" in (2, 3);
        `;

        const unPaid: any[] = await this._prisma.$queryRaw`
            select sum("total") from orders
            where "orderStatusId" in (1);
        `;

        const sold: any[] = await this._prisma.$queryRaw`
            select count("quantity") from orderitems
        `;

        const completeOrder: any[] = await this._prisma.$queryRaw`
            select count("orderStatusId") from orders
            where "orderStatusId" = 3
        `;
        const cancelOrder: any[] = await this._prisma.$queryRaw`
            select count("orderStatusId") from orders
            where "orderStatusId" = 4
        `;

        const orderDate: any[] = await this._prisma.$queryRaw`
                SELECT DATE(orders."createdAt") AS date, SUM(orders."total") AS sum
                FROM orders
                WHERE orders."createdAt" BETWEEN CURRENT_DATE - INTERVAL '15 days' AND CURRENT_DATE + 1 AND orders."orderStatusId" in (2, 3)
                GROUP BY DATE(orders."createdAt")
                ORDER BY DATE(orders."createdAt");
            `;

        return {
            countNewUser: countNewUser[0].count.toString(),
            paid: paid[0].sum.toString(),
            unPaid: unPaid[0]?.sum.toString(),
            sold: sold[0]?.count.toString(),
            statusOrder: {
                complete: completeOrder[0]?.count.toString(),
                cancel: cancelOrder[0]?.count.toString(),
            },
            orderDate,
        };
    }
}
