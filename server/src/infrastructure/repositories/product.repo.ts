import { injectable } from "inversify";
import { IProductRepository } from "../../domain/repositories/product.interface";
import "reflect-metadata";
import { Prisma, PrismaClient } from "@prisma/client";
import {
    ProductDTO,
    ProductItemDTO,
    UpdateProductDTO,
} from "../../application/dtos/product.dto";
import { BadRequestError } from "../../shared/core/error.response";
import slugify from "slugify";

@injectable()
export class ProductRepositoryImpl implements IProductRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    attributeMapping: any = {
        1: "color",
        2: "ram",
        3: "storage",
        // Add more mappings as needed
    };

    transformAttributes = (attributes: any[]) => {
        return attributes.reduce((acc, attr: any) => {
            const key = this.attributeMapping[attr.attributeId];
            if (key) {
                acc[key] = attr.attributeValue;
            }
            return acc;
        }, {});
    };

    async create(payload: any): Promise<any> {
        const {
            name,
            slug,
            desc,
            thumbnail,
            originalPrice,
            categoryId,
            brandId,
            skus,
        } = payload;

        const updatedAt = new Date();
        const releaseDate = new Date();

        try {
            await this._prisma.$transaction(async (prisma) => {
                const product = await prisma.product.create({
                    data: {
                        name,
                        slug,
                        desc,
                        thumbnail,
                        originalPrice,
                        categoryId,
                        brandId,
                        releaseDate,
                        updatedAt,
                    },
                });

                const skuPromises = skus.map(async (sku: any) => {
                    const attributes = this.transformAttributes(sku.attributes);
                    const createdSku = await prisma.sku.create({
                        data: {
                            skuNo: sku.skuNo,
                            originalPrice: sku.originalPrice,
                            salePrice: sku.salePrice,
                            stock: sku.stock,
                            thumbnail: sku.thumbnail,
                            productId: product.id,
                            updatedAt,
                            attributes: attributes,
                        },
                    });

                    const skuAttributePromises = sku.attributes.map(
                        (attr: any) =>
                            prisma.skuAttribute.create({
                                data: {
                                    skuId: createdSku.id,
                                    attributeId: attr.attributeId,
                                    attributeValue: attr.attributeValue,
                                },
                            })
                    );

                    await Promise.all(skuAttributePromises);
                    return createdSku; // Return the created sku
                });

                await Promise.all(skuPromises);
                return product; // Return the created product
            });
            return true; // Return the transaction result
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error; // Optionally handle or rethrow the error
        } finally {
            await this._prisma.$disconnect();
        }
    }

    async createProductItem(productId: number, payload: any): Promise<any> {
        try {
            const { skus } = payload;
            const updatedAt = new Date();
            await this._prisma.$transaction(async (prisma) => {
                const skuPromises = skus.map(async (sku: any) => {
                    const attributes = this.transformAttributes(sku.attributes);
                    const createdSku = await prisma.sku.create({
                        data: {
                            skuNo: sku.skuNo,
                            originalPrice: sku.originalPrice,
                            salePrice: sku.salePrice,
                            stock: sku.stock,
                            thumbnail: sku.thumbnail,
                            productId: productId,
                            updatedAt,
                            attributes: attributes,
                        },
                    });

                    const skuAttributePromises = sku.attributes.map(
                        (attr: any) =>
                            prisma.skuAttribute.create({
                                data: {
                                    skuId: createdSku.id,
                                    attributeId: attr.attributeId,
                                    attributeValue: attr.attributeValue,
                                },
                            })
                    );

                    await Promise.all(skuAttributePromises);
                    return createdSku; // Return the created sku
                });

                await Promise.all(skuPromises);
                return skuPromises; // Return the created product
            });

            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error; // Optionally handle or rethrow the error
        } finally {
            await this._prisma.$disconnect();
        }
    }

    async update(
        productId: number,
        productItemId: number,
        payload: any
    ): Promise<any> {
        const {
            name,
            desc,
            originalPrice,
            categoryId,
            brandId,
            releaseDate,
            isDraft,
            isPublished,
            thumbnail,
            skus,
        } = payload;
        console.log("payload", { productId, productItemId, skus });
        const updatedAt = new Date();
        let slug;
        if (name) {
            slug = slugify(name, { lower: true });
        }
        const query: any[] = [
            await this._prisma.$queryRaw`
            UPDATE "products"
            SET 
                "name" = COALESCE(${name}, "name"),
                "slug" = COALESCE(${slug}, "slug"),
                "desc" = COALESCE(${desc}, "desc"),
                "thumbnail" = COALESCE(${thumbnail}, "thumbnail"),
                "originalPrice" = COALESCE(${originalPrice}, "originalPrice"),
                "categoryId" = COALESCE(${categoryId}, "categoryId"),
                "brandId" = COALESCE(${brandId}, "brandId"),
                "isDraft" = COALESCE(${isDraft}, "isDraft"),
                "isPublished" = COALESCE(${isPublished}, "isPublished"),
                "releaseDate" = COALESCE(${releaseDate}, "releaseDate"),
                "updatedAt" = COALESCE(${updatedAt}, "updatedAt")
            WHERE "id" = ${productId}`,
        ];

        query.push(
            await this._prisma.$queryRaw`
            UPDATE "skus"
                SET 
                    "skuNo" = COALESCE(${skus.skuNo}, "skuNo"),
                    "productId" = COALESCE(${productId}, "productId"),
                    "stock" = COALESCE(${skus.stock}, "stock"),
                    "thumbnail" = COALESCE(${skus.thumbnail}, "thumbnail"),
                    "attributes" = COALESCE(${skus.attributes}, "attributes"),
                    "originalPrice" = COALESCE(${skus.originalPrice}, "originalPrice"),
                    "salePrice" = COALESCE(${skus.salePrice}, "salePrice"),
                    "updatedAt" = COALESCE(${updatedAt}, "updatedAt")
                WHERE "id" = ${productItemId};
            `
        );

        return await this._prisma.$transaction(async () => await query);
    }

    async findProductById(id: number): Promise<any> {
        const productChildren: any[] = await this._prisma
            .$queryRaw`SELECT * FROM "skus" WHERE "id" = ${id}`;

        return productChildren.length > 0 ? productChildren[0] : null;
    }

    async publishProductById(productId: number): Promise<any> {
        console.log(productId);

        return await this._prisma.$queryRaw`
            UPDATE "products" 
            SET 
                "isDraft" = false,
                "isPublished" = true
            WHERE "id" = ${productId}
        `;
    }

    async unPublishProductById(id: number): Promise<any> {
        return await this._prisma.$queryRaw`
            UPDATE "products" 
            SET 
                "isDraft" = true,
                "isPublished" = false
            WHERE "id" = ${id}
        `;
    }

    async queryProduct(query: any, limit: number, skip: number): Promise<any> {
        return await this._prisma.product.findMany({
            where: query,
            orderBy: [
                {
                    updatedAt: "desc",
                },
            ],
            skip: skip,
            take: limit,
        });
    }

    async searchProducts(params: string): Promise<any> {
        // const regexSearch = new RegExp(params);
        // console.log(regexSearch);
        return await this._prisma.product.findMany({
            where: {
                name: {
                    contains: params,
                },
            },
        });
    }

    async findProducts(
        limit: number,
        sort: string,
        page: number,
        filter: any
    ): Promise<any> {
        const skip = (page - 1) * limit;
        const sortBy: Prisma.UserOrderByWithRelationInput =
            sort === "ctime" ? { createdAt: "desc" } : { id: "asc" };
        return await this._prisma.product.findMany({
            where: filter,
            orderBy: [sortBy],
            skip: skip,
            take: limit,
            select: {
                id: true,
                name: true,
                originalPrice: true,
            },
        });
    }

    async findAllVariations(productId: number): Promise<any> {
        const storages: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."productId" = ${productId} AND sa."attributeId" = 2;
        `;

        return storages;
    }

    async findProduct(id: number, storage: string): Promise<any> {
        const colors: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."productId" = ${id} AND sa."attributeId" = 1;
        `;

        const products: any[] = await this._prisma.$queryRaw`
            WITH filtered_skus AS (
                SELECT sk.id
                FROM skus as sk
                JOIN skuattributes as sa ON sk.id = sa."skuId"
                WHERE sk."productId" = ${id} AND sa."attributeValue" = ${storage}
            )
            SELECT p.id, p."name", p."desc", sk."skuNo", sk."stock", sk.id as skuId, sk."originalPrice", sk."salePrice", sa."attributeValue"
            FROM skus as sk
            JOIN products as p on sk."productId" = p.id
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sa."skuId" IN (SELECT id FROM filtered_skus) AND sa."attributeId" = 1;
        `;

        return {
            colors,
            products,
        };
    }
}
