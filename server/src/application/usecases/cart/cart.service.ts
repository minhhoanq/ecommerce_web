import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ICartService } from "./cart.interface";
import { ICartRepository } from "../../../domain/repositories/cart.interface";
import { TYPES } from "../../../shared/constants/types";
import { ICartItemRepository } from "../../../domain/repositories/cartItem.interface";
import { IProductItemRepository } from "../../../domain/repositories/productItem.interface";
import { NotFoundError } from "../../../shared/core/error.response";

@injectable()
export class CartService implements ICartService {
    private _cartRepo: ICartRepository;
    private _cartItemRepo: ICartItemRepository;
    private _productItemRepo: IProductItemRepository;

    constructor(
        @inject(TYPES.CartRepository) cartRepo: ICartRepository,
        @inject(TYPES.CartItemRepository) cartItemRepo: ICartItemRepository,
        @inject(TYPES.ProductItemRepository)
        productItemRepo: IProductItemRepository
    ) {
        this._cartRepo = cartRepo;
        this._cartItemRepo = cartItemRepo;
        this._productItemRepo = productItemRepo;
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

    async updateToCart(
        userId: number,
        payload: {
            productItemId: number;
            quantity: number;
            oldQuantity: number;
        }
    ): Promise<any> {
        const { productItemId, quantity, oldQuantity } = payload;
        const productItem = await this._productItemRepo.findById(productItemId);
        if (!productItem)
            throw new NotFoundError("Product is not exsist in system!");
        const cart = await this._cartRepo.findByUserId(userId);

        if (quantity == 0) {
            //delete
            return await this._cartItemRepo.delete(userId, productItem.id);
        }

        return await this._cartItemRepo.updateQty({
            cartId: cart.id,
            productItemId: productItem.id,
            quantity: quantity - oldQuantity,
        });
    }

    async deteleCartItem(
        userId: number,
        body: { productItemId: number }
    ): Promise<any> {
        return await this._cartItemRepo.delete(userId, body.productItemId);
    }

    async getCartItems(userId: number): Promise<any> {
        return await this._cartItemRepo.findByUserId(userId);
    }
}
