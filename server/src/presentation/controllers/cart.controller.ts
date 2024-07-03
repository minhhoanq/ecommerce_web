import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ICartService } from "../../application/usecases/cart/cart.interface";
import { TYPES } from "../../shared/constants/types";
import { NextFunction, Request, Response } from "express";
import { Created } from "../../shared/core/success.response";

@injectable()
export class CartController {
    private _cartService: ICartService;

    constructor(@inject(TYPES.CartService) cartService: ICartService) {
        this._cartService = cartService;
    }

    async addToCart(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "Create cart successfully!",
                metadata: await this._cartService.addToCart(
                    req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateToCart(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "Update cart successfully!",
                metadata: await this._cartService.updateToCart(
                    req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async deleteToCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "delete cart item successfully!",
                metadata: await this._cartService.deteleCartItem(
                    req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getCartItems(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "get cart item successfully!",
                metadata: await this._cartService.getCartItems(req.user.userId),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
