import { inject, injectable } from "inversify";
import { ICheckoutService } from "./checkout.interface";
import "reflect-metadata";
import { ICheckoutRepository } from "../../../domain/repositories/checkout.interface";
import { TYPES } from "../../../shared/constants/types";
import { ICartRepository } from "../../../domain/repositories/cart.interface";
import { NotFoundError } from "../../../shared/core/error.response";
import { IProductItemRepository } from "../../../domain/repositories/productItem.interface";
import { ICartItemRepository } from "../../../domain/repositories/cartItem.interface";

@injectable()
export class CheckoutService implements ICheckoutService {
    private _checkoutRepo: ICheckoutRepository;
    private _cartRepo: ICartRepository;
    private _cartItemRepo: ICartItemRepository;
    private _productItemRepo: IProductItemRepository;

    constructor(
        @inject(TYPES.CheckoutRepository) checkoutRepo: ICheckoutRepository,
        @inject(TYPES.CartRepository) cartRepo: ICartRepository,
        @inject(TYPES.CartItemRepository) cartItemRepo: ICartItemRepository,
        @inject(TYPES.ProductItemRepository)
        productItemRepo: IProductItemRepository
    ) {
        this._checkoutRepo = checkoutRepo;
        this._cartRepo = cartRepo;
        this._productItemRepo = productItemRepo;
        this._cartItemRepo = cartItemRepo;
    }

    async checkout(userId: number, payload: any): Promise<any> {
        console.log(userId);

        const cart = await this._cartRepo.findByUserId(userId);
        console.log(cart);

        if (!cart) throw new NotFoundError("Cart not found!");
        // const listProducts = await Promise.all(
        //     payload.listItems.map(
        //         async (item: any) =>
        //             await this._productItemRepo.findById(item.productItemId)
        //     )
        // );

        // console.log(listProducts);
        const cartItems = await this._cartItemRepo.findByUserId(userId);
        console.log(cartItems);

        return cartItems;
    }
}
