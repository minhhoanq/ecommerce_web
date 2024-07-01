import { injectable } from "inversify";
import { IProductRepository } from "../../domain/repositories/product.interface";
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import {
    ProductDTO,
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
        const { name, slug, desc, originalPrice, categoryId, brandId } =
            payload;
        console.log(payload);
        const updatedAt = new Date();
        const releaseDate = new Date();
        const product: any = await this._prisma
            .$queryRaw`INSERT INTO products ("name", "slug", "desc", "originalPrice", "categoryId", "brandId", "releaseDate", "updatedAt") VALUES (${name}, 
            ${slug}, ${desc}, ${originalPrice}, ${categoryId}, ${brandId}, ${releaseDate}, ${updatedAt}) RETURNING *`;

        console.log("product ", product[0]);
        return product[0];
    }

    async createProductChildren(
        type: string,
        productId: number,
        payload: ProductDTO
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
                        .$executeRaw`INSERT INTO smartphones ( "productId",
                        "colorId",
                        "ramId",
                        "internalId",
                        "originalPrice",
                        "salePrice", "updatedAt") VALUES (${productId}, ${colorId}, ${ramId}, ${internalId}, ${originalPrice}, ${salePrice}, ${updatedAt})`;
                // case "laptop":
                //     return await this._prisma
                //         .$executeRaw`INSERT INTO users (name, "updatedAt") VALUES (${name}, ${createdAt})`;
                default:
                    return new BadRequestError("Type not valid!");
            }
        } catch (error) {
            throw error;
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
        const data = await this._prisma.product.findMany({
            where: query,
            orderBy: [
                {
                    updatedAt: "desc",
                },
            ],
            skip: skip,
            take: limit,
        });

        console.log(data);

        return data;
    }
}
