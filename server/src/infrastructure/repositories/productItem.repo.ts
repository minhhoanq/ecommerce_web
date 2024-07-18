import { PrismaClient } from "@prisma/client";
import { IProductItemRepository } from "../../domain/repositories/productItem.interface";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ProductItemRepositoryImpl implements IProductItemRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async findById(id: number): Promise<any> {
        const productItem: any[] = await this._prisma.$queryRaw`
            SELECT sk.id, pr."price" FROM skus as sk
            JOIN prices as pr on sk.id = pr."skuId"
            WHERE sk.id = ${id}
        `;

        return productItem.length > 0 ? productItem[0] : null;
    }
}
