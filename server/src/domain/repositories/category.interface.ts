import {
    CategoryCreateDTO,
    CategoryUpdateDTO,
} from "../../application/dtos/category.dto";

export interface ICategoryRepository {
    findAll(): Promise<any>;
    create(payload: CategoryCreateDTO): Promise<any>;
    update(payload: CategoryUpdateDTO): Promise<any>;
}
