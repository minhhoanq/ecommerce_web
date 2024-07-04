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
            const transactionResult = await this._prisma.$transaction(
                async (prisma) => {
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
                        const createdSku = await prisma.sku.create({
                            data: {
                                skuNo: sku.skuNo + "hhh",
                                originalPrice: sku.originalPrice,
                                salePrice: sku.salePrice,
                                stock: sku.stock,
                                thumbnail: sku.thumbnail,
                                productId: product.id,
                                updatedAt,
                                attributes: {
                                    createMany: {
                                        data: sku.attributes.map(
                                            (attr: any) => ({
                                                attributeId: attr.attributeId,
                                                attributeValue:
                                                    attr.attributeValue,
                                            })
                                        ),
                                    },
                                },
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
                }
            );

            console.log(
                "Transaction completed successfully:",
                transactionResult
            );
            return true; // Return the transaction result
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error; // Optionally handle or rethrow the error
        } finally {
            await this._prisma.$disconnect();
        }
    }

    async createProductChildren(
        type: string,
        productId: number,
        payload: ProductItemDTO
    ): Promise<any> {
        try {
            console.log(payload);
            const { colorId, ramId, internalId, originalPrice, salePrice } =
                payload;
            const updatedAt = new Date();
            console.log(payload);

            switch (type) {
                case "smartphones":
                    return await this._prisma
                        .$executeRaw`INSERT INTO smartphones ( 
                        "productId",
                        "colorId",
                        "ramId",
                        "internalId",
                        "originalPrice",
                        "salePrice", "updatedAt") 
                        VALUES (${productId}, ${colorId}, ${ramId}, ${internalId}, ${originalPrice}, ${salePrice}, ${updatedAt})`;
                // case "laptop":
                //     return await this._prisma
                //         .$executeRaw`INSERT INTO users (name, "updatedAt") VALUES (${name}, ${createdAt})`;
                default:
                    return new BadRequestError("Type not valid!");
            }
        } catch (error) {
            throw error;
        } finally {
            await this._prisma.$disconnect();
        }
    }

    async update(
        productId: number,
        productChildrenId: number,
        payload: UpdateProductDTO
    ): Promise<any> {
        const {
            type,
            name,
            desc,
            originalPrice,
            categoryId,
            brandId,
            releaseDate,
            isDraft,
            isPublished,
            colorId,
            ramId,
            internalId,
            salePrice,
        } = payload;
        console.log("payload", { productId, productChildrenId });
        const updatedAt = new Date();
        let slug;
        if (name) {
            slug = slugify(name, { lower: true });
        }
        const query: any[] = [
            this._prisma.$queryRaw`
            UPDATE "products"
            SET 
                "name" = COALESCE(${name}, "name"),
                "slug" = COALESCE(${slug}, "slug"),
                "desc" = COALESCE(${desc}, "desc"),
                "originalPrice" = COALESCE(${originalPrice}, "originalPrice"),
                "categoryId" = COALESCE(${categoryId}, "categoryId"),
                "brandId" = COALESCE(${brandId}, "brandId"),
                "isDraft" = COALESCE(${isDraft}, "isDraft"),
                "isPublished" = COALESCE(${isPublished}, "isPublished"),
                "releaseDate" = COALESCE(${releaseDate}, "releaseDate"),
                "updatedAt" = COALESCE(${updatedAt}, "updatedAt")
            WHERE "id" = ${productId}`,
        ];

        query.push(this._prisma.$queryRaw`
        UPDATE "smartphones"
            SET 
                "colorId" = COALESCE(${colorId}, "colorId"),
                "ramId" = COALESCE(${ramId}, "ramId"),
                "internalId" = COALESCE(${internalId}, "internalId"),
                "originalPrice" = COALESCE(${originalPrice}, "originalPrice"),
                "salePrice" = COALESCE(${salePrice}, "salePrice"),
                "updatedAt" = COALESCE(${updatedAt}, "updatedAt")
            WHERE "id" = ${productChildrenId};

        `);

        return await this._prisma.$transaction(query);
    }

    async findProductById(id: number): Promise<any> {
        const productChildren: any[] = await this._prisma
            .$queryRaw`SELECT * FROM "smartphones" WHERE "id" = ${id}`;

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

    async findProduct(id: number): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT * FROM "products" as p
            JOIN "smartphones" as sm on p.id = sm."productId"
            WHERE p.id = ${id}
        `;
    }
}
