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
        date: Date,
        total: number,
        payload: [
            {
                productItemId: number;
                quantity: number;
                price: number;
            }
        ]
    ): Promise<any> {
        try {
            await this._prisma.$transaction(async (prisma) => {
                await prisma.$executeRaw`
                    INSERT INTO orders (
                        "userId",
                        "paymentMethodId",
                        "addressId",
                        "date",
                        "total",
                        "updatedAt"
                    ) VALUES (${userId}, ${paymentMethodId}, ${addressId}, "now()", ${total}, "now()") 
                `;

                const orderItems = payload.map(
                    async (el: {
                        productItemId: number;
                        quantity: number;
                        price: number;
                    }) => {
                        await prisma.$executeRaw`
                            INSERT INTO orderitems (
                                "orderId",
                                "skuId",
                                "quantity",
                                "price",
                                "updatedAt"
                            ) VALUES (lastval(), ${el.productItemId}, ${el.quantity}, ${el.price}, "now()")
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
