import { injectable } from "inversify";
import "reflect-metadata";
import User from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { PrismaClient } from "@prisma/client";
import {
    CodeVerifyDTO,
    CreateUserDTO,
    FindFirstUserDTO,
    UpdateUserDTO,
} from "../../application/dtos/user.dto";
import {
    BadRequestError,
    NotFoundError,
} from "../../shared/core/error.response";

@injectable()
export class UserRepoImpl implements IUserRepository {
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
                    endsWith: `${codeverify.token}`,
                },
            },
        });
    }

    async findAll(): Promise<any[]> {
        return await this._prisma.user.findMany({
            where: {
                roleId: 2,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
            },
        });
    }

    async findFirst(data: FindFirstUserDTO): Promise<User | null> {
        const {
            id,
            firstName,
            lastName,
            email,
            password,
            status,
            passwordChangedAt,
            passwordResetToken,
            passwordResetExpires,
        } = data;
        return await this._prisma.user.findFirst({
            where: {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                status: status,
                passwordChangedAt: passwordChangedAt,
                passwordResetToken: passwordResetToken,
                passwordResetExpires: {
                    gt: passwordResetExpires,
                },
            },
        });
    }

    async findById(id: number): Promise<User | null> {
        const user: User[] = await this._prisma
            .$queryRaw`SELECT * FROM "users" WHERE id=${id}`;
        return user.length > 0 ? user[0] : null;
    }
    async create(data: any): Promise<any> {
        return await this._prisma.user.create({
            data: data,
        });
    }

    update(
        id: number,
        {
            username,
            firstName,
            lastName,
            email,
            password,
            avatar,
            gender,
            dob,
            address,
            phone,
            roleId,
            status,
            passwordChangedAt,
            passwordResetToken,
            passwordResetExpires,
        }: UpdateUserDTO
    ): Promise<User> {
        return this._prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username,
                firstName,
                lastName,
                email,
                password,
                avatar,
                gender,
                dob,
                address,
                phone: Number(phone),
                roleId,
                status,
                passwordChangedAt,
                passwordResetToken,
                passwordResetExpires,
                updatedAt: new Date(),
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

    async deleteByEmail(email: string): Promise<boolean> {
        try {
            const user = await this._prisma.user.findFirst({
                where: {
                    email: email,
                },
            });

            if (!user) return false;

            const deleteUser = await this._prisma.user.delete({
                where: {
                    email: user.email,
                },
            });

            if (!deleteUser) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}
