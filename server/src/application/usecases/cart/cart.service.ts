import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ICartService } from "./cart.interface";
import { ICartRepository } from "../../../domain/repositories/cart.interface";
import { TYPES } from "../../../shared/constants/types";
import { ICartItemRepository } from "../../../domain/repositories/cartItem.interface";

@injectable()
export class CartService implements ICartService {
    private _cartRepo: ICartRepository;
    private _cartItemRepo: ICartItemRepository;

    constructor(
        @inject(TYPES.CartRepository) cartRepo: ICartRepository,
        @inject(TYPES.CartItemRepository) cartItemRepo: ICartItemRepository
    ) {
        this._cartRepo = cartRepo;
        this._cartItemRepo = cartItemRepo;
    }

    async createCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any> {
        const { productItemId, quantity } = payload;
        const cart = await this._cartRepo.create(userId);

        return await this._cartItemRepo.create({
            cartId: cart.id,
            productItemId,
            quantity,
        });
    }

    async addToCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any> {
        const cart = await this._cartRepo.findByUserId(userId);

        if (!cart) {
            return await this.createCart(userId, payload);
        }

        const cartItem = await this._cartItemRepo.findByCartId(cart.id);
        //cart is exist but not product item
        if (!cartItem.length) {
            return await this._cartItemRepo.create({
                cartId: cart.id,
                productItemId: payload.productItemId,
                quantity: payload.quantity,
            });
        }

        //product item is already
        return await this._cartItemRepo.update({
            cartId: cart.id,
            productItemId: payload.productItemId,
            quantity: payload.quantity,
        });
    }
}
