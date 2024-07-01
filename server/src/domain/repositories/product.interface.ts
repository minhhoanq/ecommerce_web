export interface IProductRepository {
    create(payload: any): Promise<any>;
    createProductChildren(
        type: string,
        productId: number,
        payload: any
    ): Promise<any>;
    update(
        productId: number,
        productChildrenId: number,
        payload: any
    ): Promise<any>;
    findProductById(id: number): Promise<any>;
    publishProductById(id: number): Promise<any>;
    unPublishProductById(id: number): Promise<any>;
    queryProduct(query: any, limit: number, skip: number): Promise<any>;
    searchProducts(keySearch: string): Promise<any>;
}
