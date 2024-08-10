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

    async updateStatus(
        userId: number,
        orderId: number,
        orderStatusId: number
    ): Promise<any> {
        return await this._prisma.order.update({
            where: {
                id: orderId,
                userId,
            },
            data: {
                orderStatusId,
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
             SELECT o.id AS "orderId", u."firstName", u."lastName", u."phone", u."address", o."total", o."paymentMethodId", o."orderStatusId", o."createdAt", o."updatedAt",
            json_agg(
                    json_build_object(
                        'id', oi.id,
                        'productName', p."name",
                        'image', p."image",
                        'slug', sk."slug",
                        'attributes', sk."attributes",
                        'quantity', oi."quantity",
                        'price', pr."price"
                    )
                ) AS orderitems
            FROM
                orders o
            JOIN
                orderitems oi ON o.id = oi."orderId"
            JOIN skus sk on oi."skuId" = sk.id
            JOIN prices as pr on sk.id = pr."skuId"
            JOIN products p ON sk."productId" = p.id
            JOIN users u on o."userId" = u.id
            WHERE
                o."id" = ${orderId} and o."userId" = ${userId}
            GROUP BY
                o.id, u.id
        `;
    }

    async findMany(userId: number, query: any): Promise<any> {
        const { page, limit } = query;
        const skip = (+page - 1) * +limit;

        const orders: any[] = await this._prisma.$queryRaw`
            SELECT o.id AS "orderId", o."userId", o."total", o."paymentMethodId", o."orderStatusId", o."createdAt", o."updatedAt",
            json_agg(
                    json_build_object(
                        'id', oi.id,
                        'orderId', oi."orderId",
                        'productName', p."name",
                        'image', p."image",
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
            LIMIT ${+limit}
            OFFSET ${+skip}
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
            countNewUser:
                countNewUser[0]?.count !== null
                    ? countNewUser[0]?.count.toString()
                    : 0,
            paid: paid[0]?.sum !== null ? paid[0]?.sum.toString() : 0,
            unPaid: unPaid[0]?.sum !== null ? unPaid[0]?.sum.toString() : 0,
            sold: sold[0]?.count !== null ? sold[0]?.count.toString() : 0,
            statusOrder: {
                complete:
                    completeOrder[0]?.count !== null
                        ? completeOrder[0]?.count.toString()
                        : 0,
                cancel:
                    cancelOrder[0]?.count !== null
                        ? cancelOrder[0]?.count.toString()
                        : 0,
            },
            orderDate,
        };
    }

    async findAllOrders(): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT 
                o.id AS "orderId", 
                u.id AS "userId",
                u.username AS "username",
                json_agg(
                    json_build_object(
                        'productname', sk."name",
                        'productimage', p."image",
                        'quantity', oi."quantity",
                        'price', pr."price",
                        'attributes', sk."attributes"
                    )
                ) AS "products",
                o."total",
                o."orderStatusId",
                o."createdAt"
            FROM orders o
            JOIN users u ON o."userId" = u.id
            JOIN orderitems oi ON o.id = oi."orderId"
            JOIN skus sk ON oi."skuId" = sk.id
            JOIN prices pr ON sk.id = pr."skuId"
            JOIN products p ON sk."productId" = p.id
            GROUP BY o.id, u.username, u.id
            ORDER BY o.id;
        `;
    }
}
