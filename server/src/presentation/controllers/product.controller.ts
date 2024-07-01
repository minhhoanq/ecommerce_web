import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { SuccessResponse } from "../../shared/core/success.response";
import { inject, injectable } from "inversify";
import { Product, SmartPhone } from "../../domain/entities/product/product";
import { ProductService } from "../../application/usecases/product/product.service";
import { TYPES } from "../../shared/constants/types";
import { IProductService } from "../../application/usecases/product/product.interface";

@injectable()
export default class ProductController {
    private _productService: IProductService;

    constructor(@inject(TYPES.ProductService) productService: IProductService) {
        this._productService = productService;
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "get products successfully!",
                metadata: await this._productService.createProduct(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    //update product
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("check");
            new SuccessResponse({
                message: "update products successfully!",
                metadata: await this._productService.updateProduct(
                    +req.params.productItemId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
