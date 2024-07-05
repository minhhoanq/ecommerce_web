import { inject, injectable } from "inversify";
import { IOrderService } from "../../application/usecases/order/order.interface";
import { TYPES } from "../../shared/constants/types";
import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { Created, SuccessResponse } from "../../shared/core/success.response";

@injectable()
export class OrderController {
    private _orderService: IOrderService;

    constructor(@inject(TYPES.OrderService) orderService: IOrderService) {
        this._orderService = orderService;
    }

    checkout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "Checkout Upload",
                metadata: await this._orderService.checkout(
                    +req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    order = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new Created({
                message: "Order successfully!",
                metadata: await this._orderService.order(
                    +req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}
