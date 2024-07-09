export interface IProductRepository {
    create(payload: any): Promise<any>;
    createProductItem(productId: number, payload: any): Promise<any>;
    update(
        productId: number,
        productItemId: number,
        payload: any
    ): Promise<any>;
    findProductById(id: number): Promise<any>;
    publishProductById(id: number): Promise<any>;
    unPublishProductById(id: number): Promise<any>;
    queryProduct(query: any, limit: number, skip: number): Promise<any>;
    searchProducts(keySearch: string): Promise<any>;
    findProducts(
        limit: number,
        sort: string,
        page: number,
        filter: any
    ): Promise<any>;
    findAllVariations(productId: number): Promise<any>;
    findProduct(id: number, storage: string): Promise<any>;
}
