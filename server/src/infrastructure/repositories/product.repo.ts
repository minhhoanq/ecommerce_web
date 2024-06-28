import { injectable } from "inversify";
import { IProductRepository } from "../../domain/repositories/product.interface";
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { ProductDTO } from "../../application/dtos/product.dto";
import { BadRequestError } from "../../shared/core/error.response";

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
}
