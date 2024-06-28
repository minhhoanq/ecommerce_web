export interface IProductService {
    getProducts(body: {
        limit: number;
        sort: string;
        page: number;
        filters: any;
    }): Promise<any>;

    createProduct(body: any): Promise<any>;
}
