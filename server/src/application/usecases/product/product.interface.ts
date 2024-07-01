import { ProductDTO, UpdateProductDTO } from "../../dtos/product.dto";

export interface IProductService {
    getProducts(body: {
        limit: number;
        sort: string;
        page: number;
        filters: any;
    }): Promise<any>;

    createProduct(body: ProductDTO): Promise<any>;
    updateProduct(productItemId: number, body: UpdateProductDTO): Promise<any>;
}
