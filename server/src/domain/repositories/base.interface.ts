export default interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(): Promise<T>;
    update(id: number): Promise<T>;
    delete(id: number): Promise<T>;
}
