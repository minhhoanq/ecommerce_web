import { injectable } from "inversify";
import { ICategoryRepository } from "../../domain/repositories/category.interface";
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import {
    CategoryCreateDTO,
    CategoryUpdateDTO,
} from "../../application/dtos/category.dto";

@injectable()
export class CategoryRepositoryImpl implements ICategoryRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async findAll(): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT
                c.id AS categoryId,
                c."thumbnail",
                c."name" AS categoryName,
                b.id AS brandId,
                b."name" AS brandName
            FROM categories c
            LEFT JOIN categorybrands cb ON c.id = cb."categoryId"
            LEFT JOIN brands b ON cb."brandId" = b.id;
        `;
    }

    async findFirst(category: string): Promise<any> {
        return await this._prisma.$queryRaw`
            SELECT
                c.id AS categoryId,
                c."thumbnail",
                c."name" AS categoryName,
                b.id AS brandId,
                b."name" AS brandName
            FROM categories c
            LEFT JOIN categorybrands cb ON c.id = cb."categoryId"
            LEFT JOIN brands b ON cb."brandId" = b.id
            WHERE c."name" = ${category};
        `;
    }

    async create(payload: CategoryCreateDTO): Promise<any> {
        const { name } = payload;
        const updatedAt = new Date();

        return await this._prisma.$queryRaw`
            INSERT INTO categories (
                "name",
                "updatedAt"
            ) VALUES (${name}, ${updatedAt})
            RETURNING *
        `;
    }

    async update(payload: CategoryUpdateDTO): Promise<any> {
        const { id, name } = payload;
        const updatedAt = new Date();
        return await this._prisma.$queryRaw`
            UPDATE "categories"
            SET
                "name"=${name},
                "updatedAt"=${updatedAt}
            WHERE "id"=${id}
        `;
    }
}
