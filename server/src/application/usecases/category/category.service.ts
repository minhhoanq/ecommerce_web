import { inject, injectable } from "inversify";
import { ICategoryService } from "./category.interface";
import "reflect-metadata";
import { ICategoryRepository } from "../../../domain/repositories/category.interface";
import { TYPES } from "../../../shared/constants/types";
import { CategoryCreateDTO, CategoryUpdateDTO } from "../../dtos/category.dto";

interface Category {
    id: number;
    name: string;
    thumbnail: string;
    brands: { id: number; name: string }[];
}

interface Result {
    categories: Category[];
}

@injectable()
export class CategoryService implements ICategoryService {
    private _cateRepo: ICategoryRepository;

    constructor(
        @inject(TYPES.CategoryRepository) cateRepo: ICategoryRepository
    ) {
        this._cateRepo = cateRepo;
    }

    async getCategories(): Promise<any> {
        const categories: Category[] = await this._cateRepo.findAll();
        const categoriesMap: { [key: number]: Category } = {};

        // Định dạng dữ liệu
        categories.forEach((row: any) => {
            if (!categoriesMap[row.categoryid]) {
                categoriesMap[row.categoryid] = {
                    id: row.categoryid,
                    name: row.categoryname,
                    thumbnail: row.thumbnail,
                    brands: [],
                };
            }

            if (row.brandid) {
                categoriesMap[row.categoryid].brands.push({
                    id: row.brandid,
                    name: row.brandname,
                });
            }
        });

        const result: Result = {
            categories: Object.values(categoriesMap),
        };
        return result;
    }

    async getCategory(category: string): Promise<any> {
        const categories: Category[] = await this._cateRepo.findFirst(category);
        const categoriesMap: { [key: number]: Category } = {};

        // Định dạng dữ liệu
        categories.forEach((row: any) => {
            if (!categoriesMap[row.categoryid]) {
                categoriesMap[row.categoryid] = {
                    id: row.categoryid,
                    name: row.categoryname,
                    thumbnail: row.thumbnail,
                    brands: [],
                };
            }

            if (row.brandid) {
                categoriesMap[row.categoryid].brands.push({
                    id: row.brandid,
                    name: row.brandname,
                });
            }
        });

        const result: Result = {
            categories: Object.values(categoriesMap),
        };
        return result;
    }

    async createCategory(body: CategoryCreateDTO): Promise<any> {
        return await this._cateRepo.create(body);
    }

    async updateCategory(body: CategoryUpdateDTO): Promise<any> {
        return await this._cateRepo.update(body);
    }
}
