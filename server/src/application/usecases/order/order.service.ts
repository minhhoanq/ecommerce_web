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

@injectable()
export class OrderService implements IOrderService {
    private _orderRepo: IOrderRepository;
    private _cartRepo: ICartRepository;
    private _cartItemRepo: ICartItemRepository;
    private _productItemRepo: IProductItemRepository;

    constructor(
        @inject(TYPES.OrderRepository) checkoutRepo: IOrderRepository,
        @inject(TYPES.CartRepository) cartRepo: ICartRepository,
        @inject(TYPES.CartItemRepository) cartItemRepo: ICartItemRepository,
        @inject(TYPES.ProductItemRepository)
        productItemRepo: IProductItemRepository
    ) {
        this._orderRepo = checkoutRepo;
        this._cartRepo = cartRepo;
        this._productItemRepo = productItemRepo;
        this._cartItemRepo = cartItemRepo;
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
            (acc: number, item: any) => acc + item.salePrice * item.quantity,
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

    async order(userId: number, payload: any): Promise<any> {
        const cart = await this._cartRepo.findByUserId(userId);

        if (!cart) throw new NotFoundError("Cart not found!");
        const { orderItems, checkoutOrder } = await this.checkout(
            userId,
            payload
        );

        // payload.listItems
        const products = orderItems;
        const acquireProduct: boolean[] = [];
        for (let i = 0; i < products.length; i++) {
            const { id, quantity } = products[i];
            const keyLock = await acquireLock(id, quantity, cart.id);
            acquireProduct.push(keyLock ? true : false);
            console.log("chjcek");

            if (keyLock) {
                console.log("check");

                await releaseLock(keyLock);
            }
        }

        if (acquireProduct.includes(false)) {
            throw new BadRequestError(
                "Some products have been updated, Please return to the cart..."
            );
        }

        // create order
        const order = await this._orderRepo.create(
            userId,
            1,
            1,
            new Date(),
            checkoutOrder.total,
            orderItems
        );
        if (!order) {
            return false;
        }
        return true;
    }
}