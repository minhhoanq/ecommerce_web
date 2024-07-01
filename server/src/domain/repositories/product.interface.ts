export interface IProductRepository {
    create(payload: any): Promise<any>;
    createProductChildren(
        type: string,
        productId: number,
        payload: any
    ): Promise<any>;
    update(
        type: string,
        productId: number,
        productChildrenId: number,
        payload: any
    ): Promise<any>;
    findProductById(id: number): Promise<any>;
}
