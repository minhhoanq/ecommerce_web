import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { SuccessResponse } from "../../shared/core/success.response";
import { injectable } from "inversify";

@injectable()
export default class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "get products successfully!",
                metadata: "ok!",
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
