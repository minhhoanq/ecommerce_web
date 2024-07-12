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
            await this._prisma.$transaction(async (prisma) => {
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
                return orderItems;
            });

            return true;
        } catch (error) {
            throw error;
        } finally {
            await this._prisma.$disconnect();
        }
    }
}
