import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { SuccessResponse } from "../../shared/core/success.response";
import { inject, injectable } from "inversify";
import { Product, SmartPhone } from "../../domain/entities/product/product";
import { ProductService } from "../../application/usecases/product/product.service";
import { TYPES } from "../../shared/constants/types";
import { IProductService } from "../../application/usecases/product/product.interface";

interface QueryParams {
    limit: number;
    sort: string;
    page: number;
    filter: any;
}

function parseQueryParams(query: any): QueryParams {
    return {
        limit: parseInt(query.limit, 10) || 10,
        sort: query.sort || "ctime",
        page: parseInt(query.page, 10) || 1,
        filter: query.filter || {},
    };
}

@injectable()
export class ProductController {
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

    async createProductItem(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "get products successfully!",
                metadata: await this._productService.createProductItem(
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    //update product
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
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

    //publish, unPublish product
    async publishProduct(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "publishProduct successfully!",
                metadata: await this._productService.publishProduct(
                    +req.params.productId
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async unPublishProduct(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "unPublishProduct successfully!",
                metadata: await this._productService.unPublishProduct(
                    +req.params.productId
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getPublishs(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getPublishs successfully!",
                metadata: await this._productService.getPublishs({
                    limit: Number(req.query.limit),
                    skip: Number(req.query.skip),
                }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getDrafts(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getDrafts successfully!",
                metadata: await this._productService.getDrafts({
                    limit: Number(req.query.limit),
                    skip: Number(req.query.skip),
                }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async searchs(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "search successfully!",
                metadata: await this._productService.searchs(
                    req.params.keySearch
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getProducts successfully!",
                metadata: await this._productService.getProducts(
                    parseQueryParams(req.query)
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getProductsManager(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getProducts successfully!",
                metadata: await this._productService.getProductsManager(
                    parseQueryParams(req.query)
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getVariations(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getProducts successfully!",
                metadata: await this._productService.getVariations(
                    req.params.slug,
                    req.params.category
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "getProduct successfully!",
                metadata: await this._productService.getProduct(
                    req.params.slug
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getFeedbackProductItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            new SuccessResponse({
                message: "get feedback product item successfully!",
                metadata: await this._productService.getFeedbackProductItem(
                    req.params.slug
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "search successfully!",
                metadata: await this._productService.searchProducts(req.query),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
