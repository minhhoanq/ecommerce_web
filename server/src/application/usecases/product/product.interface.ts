import { UpdateProductDTO } from "../../dtos/product.dto";

export interface IProductService {
    createProduct(body: any): Promise<any>;
    createProductItem(body: any): Promise<any>;
    updateProduct(productItemId: number, body: any): Promise<any>;
    publishProduct(productId: number): Promise<any>;
    unPublishProduct(productId: number): Promise<any>;
    getPublishs({ limit, skip }: { limit: number; skip: number }): Promise<any>;
    getDrafts({ limit, skip }: { limit: number; skip: number }): Promise<any>;

    searchs(keySearch: string): Promise<any>;
    getProducts({
        limit,
        sort,
        page,
        filter,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
    }): Promise<any>;

    getProductsManager({
        limit,
        sort,
        page,
        filter,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
    }): Promise<any>;

    getVariations(slug: string, category: string): Promise<any>;

    getProduct(slug: string): Promise<any>;
    getFeedbackProductItem(slug: string): Promise<any>;
    searchProducts(query: any): Promise<any>;
}
