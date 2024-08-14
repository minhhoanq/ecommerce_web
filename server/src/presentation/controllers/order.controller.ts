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

    updateOrderStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            new SuccessResponse({
                message: "Update order successfully!",
                metadata: await this._orderService.updateOrderStatus(
                    +req.body.userId,
                    +req.body.orderId,
                    +req.body.orderStatusId
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

    createPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new Created({
                message: "create payment successfully!",
                metadata: await this._orderService.createPayment(
                    +req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    eventWebhooks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "create payment successfully!",
                metadata: await this._orderService.eventWebhooks(
                    req.headers["stripe-signature"] as string,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    getOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "Order successfully!",
                metadata: await this._orderService.getOrderDetail(
                    +req.user.userId,
                    +req.params.orderId
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    getOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "Order successfully!",
                metadata: await this._orderService.getOrders(
                    +req.user.userId,
                    req.query
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    getStatistical = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            new SuccessResponse({
                message: "Get statistical successfully!",
                metadata: await this._orderService.getStatistical(),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({
                message: "Order successfully!",
                metadata: await this._orderService.getAllOrders(req.query),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}
