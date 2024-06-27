export interface IProductRepository {
    create(payload: any): Promise<any>;
    createProductChildren(payload: any): Promise<any>;
}
