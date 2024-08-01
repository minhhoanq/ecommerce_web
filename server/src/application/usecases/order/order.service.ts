import { inject, injectable } from "inversify";
import { IOrderService } from "./order.interface";
import "reflect-metadata";
import { IOrderRepository } from "../../../domain/repositories/order.interface";
import { TYPES } from "../../../shared/constants/types";
import { ICartRepository } from "../../../domain/repositories/cart.interface";
import {
    BadRequestError,
    NotFoundError,
} from "../../../shared/core/error.response";
import { IProductItemRepository } from "../../../domain/repositories/productItem.interface";
import { ICartItemRepository } from "../../../domain/repositories/cartItem.interface";
import { acquireLock, releaseLock } from "../redis/redis.service";
import { IUserRepository } from "../../../domain/repositories/user.interface";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

@injectable()
export class OrderService implements IOrderService {
    private _orderRepo: IOrderRepository;
    private _cartRepo: ICartRepository;
    private _cartItemRepo: ICartItemRepository;
    private _productItemRepo: IProductItemRepository;
    private _userRepo: IUserRepository;

    constructor(
        @inject(TYPES.OrderRepository) checkoutRepo: IOrderRepository,
        @inject(TYPES.CartRepository) cartRepo: ICartRepository,
        @inject(TYPES.CartItemRepository) cartItemRepo: ICartItemRepository,
        @inject(TYPES.ProductItemRepository)
        productItemRepo: IProductItemRepository,
        @inject(TYPES.UserRepository) userRepo: IUserRepository
    ) {
        this._orderRepo = checkoutRepo;
        this._cartRepo = cartRepo;
        this._productItemRepo = productItemRepo;
        this._cartItemRepo = cartItemRepo;
        this._userRepo = userRepo;
    }

    //checkout review all product items for user
    async checkout(userId: number, payload: any): Promise<any> {
        const cart = await this._cartRepo.findByUserId(userId);

        if (!cart) throw new NotFoundError("Cart not found!");

        const cartItems = await this._cartItemRepo.findByUserId(userId);

        const checkoutOrder = {
            total: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };

        //check product is exists
        const listProducts = await Promise.all(
            payload.listItems.map(
                async (item: any) =>
                    await this._productItemRepo.findById(item.productItemId)
            )
        );

        //match listitems of user with cartitems of user
        const commonItems = cartItems.filter((cartItem: any) =>
            listProducts.some(
                (item: any) => item.id === cartItem.id
                // item.quantity === cartItem.quantity
            )
        );

        //review total price
        const total = commonItems.reduce(
            (acc: number, item: any) => acc + item.price * item.quantity,
            0
        );

        //handle checkout, feeship
        //handle checkout, feeship

        checkoutOrder.total = total;
        // review again total, but not discount
        checkoutOrder.totalCheckout = total;

        return {
            orderItems: commonItems,
            checkoutOrder: checkoutOrder,
        };
    }

    async updateOrderStatus(userId: number, orderId: number): Promise<any> {
        return await this._orderRepo.updateStatus(userId, orderId);
    }

    async order(userId: number, payload: any): Promise<any> {
        console.log("payload: ", payload);

        const cart = await this._cartRepo.findByUserId(userId);

        if (!cart) throw new NotFoundError("Cart not found!");
        const { orderItems, checkoutOrder } = await this.checkout(
            userId,
            payload
        );

        // payload.listItems;

        // const products = orderItems;
        // const acquireProduct: boolean[] = [];
        // for (let i = 0; i < products.length; i++) {
        //     const { id, quantity } = products[i];
        //     const keyLock = await acquireLock(id, quantity, cart.id);
        //     acquireProduct.push(keyLock ? true : false);
        //     console.log("chjcek 1", keyLock);

        //     if (keyLock) {
        //         console.log("check");

        //         await releaseLock(keyLock);
        //     }
        // }

        // if (acquireProduct.includes(false)) {
        //     throw new BadRequestError(
        //         "Some products have been updated, Please return to the cart..."
        //     );
        // }

        // create order
        const order = await this._orderRepo.create(
            userId,
            payload.paymentMethodId,
            1,
            checkoutOrder.total,
            orderItems
        );
        if (!order) {
            return false;
        }

        const urlResult = `http://localhost:3000/order/result?orderId=${order.id}`;
        return {
            order,
            urlResult,
        };
    }

    async createPayment(userId: number, payload: any): Promise<any> {
        const cart = await this._cartRepo.findByUserId(userId);
        console.log(userId + " | " + payload);

        if (!cart) throw new NotFoundError("Cart not found!");
        const { orderItems, checkoutOrder } = await this.checkout(
            userId,
            payload
        );

        payload.paymentMethodId = 2;

        console.log(orderItems);

        const response = await this.order(+userId, payload);
        console.log("res", response);

        if (response.order) {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: orderItems.map((item: any) => {
                    return {
                        price_data: {
                            currency: "vnd",
                            product_data: {
                                name: item.name,
                            },
                            unit_amount: item.price,
                        },
                        quantity: item.quantity,
                    };
                }),
                success_url: response.urlResult,
                cancel_url: "http://localhost:3000/checkout",
                metadata: {
                    userId: userId,
                    orderId: response?.order?.id,
                },
            });
            return { url: session.url };
        }
        return null;
    }

    async eventWebhooks(signature: string, payload: any): Promise<any> {
        const endpointSecret = process.env.STRIPE_END_POINT_SECRET as string;
        let event: Stripe.Event;
        console.log("Vo webhook");

        try {
            // Construct the event from the payload and signature
            event = stripe.webhooks.constructEvent(
                payload,
                signature,
                endpointSecret
            );
        } catch (error) {
            throw new Error(`Webhook Error: ${error}`);
        }

        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === "checkout.session.completed") {
            if (session.metadata) {
                const userId = session.metadata.userId;
                const orderId = session.metadata.orderId;
                await this._orderRepo.updateStatus(+userId, +orderId);
                // console.log(userId + " | " + orderId);
            }
        } else {
            // Handle payment failure or session expiration
            if (session.metadata) {
                const userId = session.metadata.userId;
                const orderId = session.metadata.orderId;
                await this._orderRepo.delete(+orderId, +orderId);
                console.log(
                    `Order ${orderId} for user ${userId} has been deleted due to payment failure or session expiration.`
                );
            }
        }
    }

    async getOrderDetail(userId: number, orderId: number): Promise<any> {
        return await this._orderRepo.findFirst(userId, orderId);
    }

    async getOrders(userId: number): Promise<any> {
        return await this._orderRepo.findMany(userId);
    }

    async checkInfoFeedback(data: {
        userId: number;
        orderItemId: number;
    }): Promise<any> {
        const { userId, orderItemId } = data;
        console.log(data);

        const orderItem = await this._orderRepo.findFirstOrderItem(orderItemId);
        console.log(orderItem);
        const user = await this._userRepo.findById(userId);
        if (!orderItem) {
            return null;
        }
        return {
            user,
            orderItemId: orderItem.id,
        };
    }

    async SubscribeEvents(payload: { event: string; data: any }) {
        const { event, data } = payload;
        console.log("chgeck");

        switch (event) {
            case "CHECK_INFO_FEEDBACK":
                return await this.checkInfoFeedback(data);

            default:
                return null;
        }
    }

    async getStatistical(): Promise<any> {
        return await this._orderRepo.getStatistical();
    }

    async getAllOrders(): Promise<any> {
        return await this._orderRepo.findAllOrders();
    }
}
