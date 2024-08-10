import {
    BadRequestError,
    NotFoundError,
} from "../../../shared/core/error.response";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../shared/constants/types";
import { IProductRepository } from "../../../domain/repositories/product.interface";
import { IProductService } from "./product.interface";
import {
    ProductDTO,
    ProductItemDTO,
    UpdateProductDTO,
} from "../../dtos/product.dto";
import slugify from "slugify";
import initEs from "../../../infrastructure/elasticsearch/index";

const clientEs = initEs.getClients();

//Product Factory
@injectable()
export class ProductService implements IProductService {
    private _productRepo: IProductRepository;

    constructor(
        @inject(TYPES.ProductRepository) productRepo: IProductRepository
    ) {
        this._productRepo = productRepo;
    }

    async createProduct(body: any): Promise<any> {
        const { name, desc, image, categoryId, brandId, images, skus } = body;
        //create new product
        const newProduct = await this._productRepo.create({
            name,
            desc,
            image,
            categoryId,
            brandId,
            images,
            skus,
        });

        return newProduct;
    }

    //create skus
    async createProductItem(body: any): Promise<any> {
        const newProductItem = await this._productRepo.createProductItem(
            body.productId,
            { ...body }
        );
        return newProductItem;
    }

    async updateProduct(productItemId: number, body: any): Promise<any> {
        const productItem = await this._productRepo.findProductById(
            productItemId
        );

        if (!productItem) throw new NotFoundError("Product not found!");

        const updateProduct = await this._productRepo.update(
            productItem.productId,
            productItemId,
            body
        );

        return updateProduct;
    }

    async publishProduct(productId: number): Promise<any> {
        return await this._productRepo.publishProductById(productId);
    }

    async unPublishProduct(productId: number): Promise<any> {
        return await this._productRepo.unPublishProductById(productId);
    }

    async getPublishs({
        limit,
        skip,
    }: {
        limit: number;
        skip: number;
    }): Promise<any> {
        const query = { isPublished: true };
        const data = await this._productRepo.queryProduct(query, limit, skip);

        return data;
    }

    async getDrafts({
        limit,
        skip,
    }: {
        limit: number;
        skip: number;
    }): Promise<any> {
        const query = { isDraft: true };
        const data = await this._productRepo.queryProduct(query, limit, skip);
        return data;
    }

    async searchs(keySearch: string): Promise<any> {
        const data = await this._productRepo.searchProducts(keySearch);

        return data;
    }

    async getVariations(slug: string, category: string): Promise<any> {
        return await this._productRepo.findAllVariations(slug, category);
    }

    async getProducts({
        limit,
        sort,
        page,
        filter,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
    }): Promise<any> {
        return await this._productRepo.findProducts(limit, sort, page, filter);
    }

    async getProductsManager({
        limit,
        sort,
        page,
        filter,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
    }): Promise<any> {
        return await this._productRepo.findProductsManager(
            limit,
            sort,
            page,
            filter
        );
    }

    async getProduct(slug: string): Promise<any> {
        const product = await this._productRepo.findProduct(slug);

        return product;
    }

    async getFeedbackProductItem(slug: string): Promise<any> {
        const feedbackProductItems =
            await this._productRepo.findFeedbackProductItem(slug);

        return feedbackProductItems;
    }

    capitalizeFirstLetter(string: string) {
        if (string.length === 0) return string;
        return string.toLocaleLowerCase();
    }

    async searchProducts(query: any): Promise<any> {
        const {
            q,
            category,
            brand,
            minPrice,
            maxPrice,
            page,
            limit,
            sortPrice,
        } = query;

        const skip = (+page - 1) * +limit;

        let categoryQuery = null;
        if (category) {
            categoryQuery = this.capitalizeFirstLetter(category);
        }
        let brandQuery = null;
        if (brand) {
            brandQuery = this.capitalizeFirstLetter(brand);
        }

        const esQuery = {
            query: {
                bool: {
                    must: [
                        // Nếu có giá trị cho `name`, sử dụng match_phrase_prefix
                        ...(q
                            ? [
                                  {
                                      match: {
                                          name: {
                                              query: q,
                                              fuzziness: "AUTO",
                                              operator: "or",
                                          },
                                      },
                                  },
                              ]
                            : []), // Nếu không có giá trị cho `name`, không thêm điều kiện này
                    ],
                    filter: [
                        // Điều kiện lọc theo category nếu có giá trị
                        ...(category
                            ? [{ term: { category: categoryQuery } }]
                            : []),
                        // Điều kiện lọc theo brand nếu có giá trị
                        ...(brand ? [{ term: { brand: brandQuery } }] : []),
                        // Điều kiện lọc theo giá chỉ được thêm nếu có giá trị cho minPrice và maxPrice
                        ...(minPrice != null && maxPrice != null
                            ? [
                                  {
                                      range: {
                                          price: {
                                              gte: minPrice,
                                              lte: maxPrice,
                                          },
                                      },
                                  },
                              ]
                            : []),
                    ],
                },
            },
            from: skip || 0,
            size: limit || 8,
            ...(sortPrice ? { sort: [{ price: { order: sortPrice } }] } : {}),
        };

        const resultEs = await clientEs.elasticClient?.search({
            index: "products_idx",
            body: esQuery,
        });

        return {
            total: resultEs?.body?.hits?.total?.value,
            result: resultEs?.body?.hits?.hits,
        };
    }
}
