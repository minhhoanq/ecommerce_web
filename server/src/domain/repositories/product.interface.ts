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
    findProductsManager(
        limit: number,
        sort: string,
        page: number,
        filter: any
    ): Promise<any>;
    findAllVariations(slug: string, category: string): Promise<any>;
    findProduct(slug: string): Promise<any>;
    findFeedbackProductItem(slug: string): Promise<any>;
    findBestSellers(): Promise<any>;
}
