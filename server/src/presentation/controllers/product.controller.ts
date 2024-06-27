import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { SuccessResponse } from "../../shared/core/success.response";
import { injectable } from "inversify";
import { Product, SmartPhone } from "../../domain/entities/product/product";
import { ProductFatory } from "../../application/usecases/product/product.factory";

@injectable()
export default class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "get products successfully!",
                metadata: await ProductFatory.createProduct("Smart Phone", ""),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
