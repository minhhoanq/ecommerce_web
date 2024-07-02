import { inject, injectable } from "inversify";
import { ICategoryService } from "./category.interface";
import "reflect-metadata";
import { ICategoryRepository } from "../../../domain/repositories/category.interface";
import { TYPES } from "../../../shared/constants/types";
import { CategoryCreateDTO, CategoryUpdateDTO } from "../../dtos/category.dto";

@injectable()
export class CategoryService implements ICategoryService {
    private _cateRepo: ICategoryRepository;

    constructor(
        @inject(TYPES.CategoryRepository) cateRepo: ICategoryRepository
    ) {
        this._cateRepo = cateRepo;
    }

    async getCategories(): Promise<any> {
        return await this._cateRepo.findAll();
    }

    async createCategory(body: CategoryCreateDTO): Promise<any> {
        return await this._cateRepo.create(body);
    }

    async updateCategory(body: CategoryUpdateDTO): Promise<any> {
        return await this._cateRepo.update(body);
    }
}
