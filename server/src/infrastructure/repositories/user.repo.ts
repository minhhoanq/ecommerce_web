import { injectable } from "inversify";
import "reflect-metadata";
import User from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { PrismaClient } from "@prisma/client";
import { CodeVerifyDTO, CreateUserDTO } from "../../application/dtos/user.dto";

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

    async findByCodeVerify(codeverify: CodeVerifyDTO): Promise<User | null> {
        return await this._prisma.user.findFirst({
            where: {
                email: {
                    endsWith: `${codeverify}`,
                },
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
    update(id: number, email: any): Promise<User> {
        return this._prisma.user.update({
            where: {
                id: id,
            },
            data: {
                email: email,
            },
        });
    }
    async delete(id: number): Promise<boolean> {
        const deleteUser = await this._prisma.user.delete({
            where: {
                id,
            },
        });

        if (!deleteUser) {
            return true;
        }
        return false;
    }
}
