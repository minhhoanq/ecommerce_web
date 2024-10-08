import { CategoryCreateDTO, CategoryUpdateDTO } from "../../dtos/category.dto";

export interface ICategoryService {
    getCategories(): Promise<any>;
    getCategory(category: string): Promise<any>;
    createCategory(body: CategoryCreateDTO): Promise<any>;
    updateCategory(body: CategoryUpdateDTO): Promise<any>;
}
