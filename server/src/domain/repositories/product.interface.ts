export interface IProductRepository {
    create(payload: any): Promise<any>;
    createProductChildren(
        type: string,
        productId: number,
        payload: any
    ): Promise<any>;
}
