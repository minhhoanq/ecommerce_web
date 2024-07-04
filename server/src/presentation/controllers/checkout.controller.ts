import { inject, injectable } from "inversify";
import { ICheckoutService } from "../../application/usecases/checkout/checkout.interface";
import { TYPES } from "../../shared/constants/types";
import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../shared/core/success.response";

@injectable()
export class CheckoutController {
    private _checkoutService: ICheckoutService;

    constructor(
        @inject(TYPES.CheckoutService) checkoutService: ICheckoutService
    ) {
        this._checkoutService = checkoutService;
    }

    checkout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "Checkout Upload",
                metadata: await this._checkoutService.checkout(
                    +req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}
