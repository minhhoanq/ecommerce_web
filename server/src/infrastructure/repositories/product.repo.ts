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
import { sendProductsByKafka } from "../kafka";
import { RPCRequest } from "../rabbitmq";

@injectable()
export class ProductRepositoryImpl implements IProductRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    attributeMapping: any = {
        1: "color",
        2: "ram",
        3: "inch",
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
        const { name, desc, categoryId, brandId, image, images, skus } =
            payload;

        const updatedAt = new Date();
        const releaseDate = new Date();

        const categoryBrand: any[] = await this._prisma.$queryRaw`
            select id from categorybrands
            where "categoryId" = ${parseInt(
                categoryId
            )} and "brandId" = ${parseInt(brandId)}
        `;

        try {
            await this._prisma.$transaction(async (prisma) => {
                const product = await prisma.product.create({
                    data: {
                        name,
                        desc,
                        image,
                        categoryBrandId: categoryBrand[0].id,
                        releaseDate,
                        updatedAt,
                    },
                });

                const skuPromises = skus.map(async (sku: any) => {
                    const attributes = this.transformAttributes(sku.attributes);

                    const createdSku = await prisma.sku.create({
                        data: {
                            name: sku.name,
                            slug: slugify(sku.name, { lower: true }),
                            productId: product.id,
                            updatedAt,
                            attributes: attributes,
                        },
                    });

                    const skuAttributePromises = await sku.attributes.map(
                        async (attr: any) =>
                            await prisma.skuAttribute.create({
                                data: {
                                    skuId: createdSku.id,
                                    attributeId: attr.attributeId,
                                    attributeValue: attr.attributeValue,
                                },
                            })
                    );

                    await prisma.price.create({
                        data: {
                            skuId: createdSku.id,
                            price: sku.price,
                            startDate: updatedAt,
                            endDate: updatedAt,
                            active: true,
                        },
                    });

                    await prisma.inventory.create({
                        data: {
                            skuId: createdSku.id,
                            warehouseId: 1,
                            stock: sku.stock,
                        },
                    });

                    await Promise.all(skuAttributePromises);
                    return createdSku; // Return the created sku
                });

                const imageProducts = await images.map(async (el: string) => {
                    await prisma.imageProduct.create({
                        data: {
                            productId: product.id,
                            src: el,
                        },
                    });
                });
                await Promise.all(imageProducts);
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
                            name: sku.name,
                            slug: slugify(sku.name, { lower: true }),
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
            categoryBrandId,
            releaseDate,
            isDraft,
            isPublished,
            thumbnail,
            skus,
        } = payload;
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
                "categoryBrandId" = COALESCE(${categoryBrandId}, "categoryBrandId"),
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
        const products = await this._prisma.product.findMany({
            where: filter,
            orderBy: [sortBy],
            skip: skip,
            take: 9,
            include: {
                skus: {
                    take: 1, // Lấy 1 SKU đại diện cho mỗi sản phẩm
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        attributes: true,
                        createdAt: true,
                        updatedAt: true,
                        prices: {
                            select: {
                                price: true,
                            },
                        },
                    },
                },
                categorybrand: {
                    select: {
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                imageProducts: {
                    select: {
                        id: true,
                        src: true,
                    },
                },
            },
        });

        const productSkus: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT ON (sk."name") sk.id, sk."name", sk."slug", pr."price", p."image", ca."name" as category, br."name" as brand 
            FROM products as p
            JOIN skus AS sk ON p.id = sk."productId"
            JOIN categorybrands as cb on p."categoryBrandId" = cb.id
            JOIN categories as ca on cb."categoryId" = ca.id
            JOIN brands as br on cb."brandId" = br.id
            JOIN prices AS pr ON sk.id = pr."skuId"
        `;

        await sendProductsByKafka(productSkus);

        return products;
    }

    async findProductsManager(
        limit: number,
        sort: string,
        page: number,
        filter: any
    ): Promise<any> {
        const skip = (page - 1) * limit;
        const sortBy: Prisma.UserOrderByWithRelationInput =
            sort === "ctime" ? { createdAt: "desc" } : { id: "asc" };
        const products = await this._prisma.product.findMany({
            where: filter,
            orderBy: [sortBy],
            skip: skip,
            take: 9,
            include: {
                skus: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        attributes: true,
                        createdAt: true,
                        updatedAt: true,
                        inventories: {
                            select: {
                                stock: true,
                            },
                        },
                        prices: {
                            select: {
                                price: true,
                            },
                        },
                    },
                },
                categorybrand: {
                    select: {
                        category: {
                            select: {
                                name: true,
                            },
                        },
                        brand: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                imageProducts: {
                    select: {
                        id: true,
                        src: true,
                    },
                },
            },
        });

        const productSkus: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT ON (sk."name") sk.id, sk."name", sk."slug", pr."price", p."image", ca."name" as category, br."name" as brand 
            FROM products as p
            JOIN skus AS sk ON p.id = sk."productId"
            JOIN categorybrands as cb on p."categoryBrandId" = cb.id
            JOIN categories as ca on cb."categoryId" = ca.id
            JOIN brands as br on cb."brandId" = br.id
            JOIN prices AS pr ON sk.id = pr."skuId"
        `;

        await sendProductsByKafka(productSkus);

        return products;
    }

    async findAllVariations(slug: string, category: string): Promise<any> {
        let attributeQuery;
        switch (category) {
            case "camera":
                attributeQuery = 1;
                break;
            case "smartphone":
            case "laptop":
            case "tablet":
                attributeQuery = 2;
                break;
            case "television":
                attributeQuery = 3;
                break;
            default:
                break;
        }

        const sku: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sk."productId", sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."slug" = ${slug} AND sa."attributeId" = ${attributeQuery};
        `;

        const colors: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sk."productId", sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."productId" = ${sku[0]?.productId} AND sa."attributeId" = 1;
        `;

        const storages: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sk."productId", sk."slug", sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."productId" = ${sku[0]?.productId} AND sa."attributeId" = 2;
        `;

        const inchs: any[] = await this._prisma.$queryRaw`
            SELECT DISTINCT sk."productId", sk."slug", sa."attributeValue" FROM skus as sk
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            WHERE sk."productId" = ${sku[0]?.productId} AND sa."attributeId" = 3;
            `;

        return {
            sku,
            colors,
            storages,
            inchs,
        };
    }

    async findProduct(slug: string): Promise<any> {
        const category: any[] = await this._prisma.$queryRaw`
            select DISTINCT c.id, c."name" from skus as sk
            join products as pr on sk."productId" = pr.id
            join categorybrands as cb on pr."categoryBrandId" = cb.id
            join categories as c on cb."categoryId" = c.id
            where sk."slug" = ${slug}
        `;
        let attributeIdQuery;
        switch (category[0]?.id) {
            case 1:
            case 2:
            case 3:
                attributeIdQuery = 1;
                break;
            case 4:
                attributeIdQuery = 1;
                break;
            case 5:
                attributeIdQuery = 3;
                break;
            default:
                break;
        }

        const products: any[] = await this._prisma.$queryRaw`
            WITH filtered_skus AS (
                SELECT sk.id
                FROM skus as sk
                JOIN skuattributes as sa ON sk.id = sa."skuId"
                WHERE sk."slug" = ${slug}
            )
            SELECT p.id, p."name", p."image", sk."slug", p."desc",  pr."price", i."stock" as quantity, sk.id as skuId, sa."attributeValue"
            FROM skus as sk
            JOIN products as p on sk."productId" = p.id
            JOIN skuattributes as sa ON sk.id = sa."skuId"
            JOIN prices as pr ON sk.id = pr."skuId"
            JOIN inventories as i ON sk.id = i."skuId"
            WHERE sa."skuId" IN (SELECT id FROM filtered_skus) AND sa."attributeId" = ${attributeIdQuery};
        `;
        const images: any[] = await this._prisma.imageProduct.findMany({
            where: {
                productId: products[0].id,
            },
            select: {
                id: true,
                productId: true,
                src: true,
            },
        });

        return {
            images,
            products,
        };
    }

    async findFeedbackProductItem(slug: string): Promise<any> {
        const orderItems = await this._prisma.$queryRaw`
            SELECT oi.id FROM orderitems as oi
            JOIN skus as sk on oi."skuId" = sk.id
            WHERE sk."slug" = ${slug}
        `;

        const payload = {
            event: "GET_FEEDBACK_ITEM",
            data: orderItems,
        };

        const response: any[] = (await RPCRequest(
            process.env.MAIN_FEEDBACK_RPC as string,
            payload
        )) as any[];

        const userIds = [
            ...new Set(response.map((feedback) => feedback.userId)),
        ];
        const users = await this._prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                firstName: true,
                lastName: true,
            },
        });

        const feedbacksWithUserInfo = response.map((feedback) => {
            const user = users.find((user) => user.id === feedback.userId);
            return { ...feedback, user };
        });

        return feedbacksWithUserInfo;
    }
}
