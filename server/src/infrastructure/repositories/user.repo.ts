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
        console.log(codeverify.code);
        return await this._prisma.user.findFirst({
            where: {
                email: {
                    endsWith: `${codeverify.code}`,
                },
            },
        });
    }

    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    async findFirst(data: FindFirstUserDTO): Promise<User | null> {
        const {
            id,
            firstName,
            lastName,
            email,
            password,
            status,
            isVerify,
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
                isVerify: isVerify,
                passwordChangedAt: passwordChangedAt,
                passwordResetToken: passwordResetToken,
                passwordResetExpires: {
                    gt: passwordResetExpires,
                },
            },
        });
    }

    findById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
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
            phone,
            roleId,
            status,
            isVerify,
            passwordChangedAt,
            passwordResetToken,
            passwordResetExpires,
        }: UpdateUserDTO
    ): Promise<User> {
        console.log({
            username,
            firstName,
            lastName,
            email,
            password,
            avatar,
            gender,
            dob,
            phone,
            roleId,
            status,
            isVerify,
            passwordChangedAt,
            passwordResetToken,
            passwordResetExpires,
        });
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
                phone,
                roleId,
                status,
                isVerify,
                passwordChangedAt,
                passwordResetToken,
                passwordResetExpires,
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
