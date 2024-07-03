export interface IProductItemRepository {
    findById(id: number): Promise<any>;
}
