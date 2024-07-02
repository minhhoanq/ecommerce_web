import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ICategoryService } from "../../application/usecases/category/category.interface";
import { TYPES } from "../../shared/constants/types";
import { NextFunction, Request, Response } from "express";
import { Created, SuccessResponse } from "../../shared/core/success.response";

@injectable()
export class CategoryController {
    private _cateService: ICategoryService;

    constructor(@inject(TYPES.CategoryService) cateService: ICategoryService) {
        this._cateService = cateService;
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "get all categories successfully!",
                metadata: await this._cateService.getCategories(),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "create category successfully!",
                metadata: await this._cateService.createCategory(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "create category successfully!",
                metadata: await this._cateService.updateCategory(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
