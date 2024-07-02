import {
    ProductDTO,
    ProductItemDTO,
    UpdateProductDTO,
} from "../../dtos/product.dto";

export interface IProductService {
    createProduct(body: ProductDTO): Promise<any>;
    createProductItem(body: ProductItemDTO): Promise<any>;
    updateProduct(productItemId: number, body: UpdateProductDTO): Promise<any>;
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

    getProduct(id: number): Promise<any>;
}
