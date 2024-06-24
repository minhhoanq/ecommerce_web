import { BaseCreateEntityType } from "../../shared/types/baseCreateEntityType";

export default interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    delete(id: number): Promise<T>;
}
