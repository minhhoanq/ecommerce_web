import { injectable } from "inversify";
import "reflect-metadata";
import User from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { PrismaClient } from "@prisma/client";
import { CreateUserDTO } from "../../application/dtos/user.dto";

@injectable()
export default class UserRepoImpl implements IUserRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }
    async createUser(user: any): Promise<any> {
        return await this._prisma.user.create({
            data: user,
        });
    }

    async findByEmail(email: string): Promise<any> {
        return await this._prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    async create(data: any): Promise<any> {
        return await this._prisma.user.create({
            data: data,
        });
    }
    update(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
