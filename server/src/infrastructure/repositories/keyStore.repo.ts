import { Prisma, PrismaClient } from "@prisma/client";
import { KeyStore } from "../../domain/entities/keyStore";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import { BaseCreateEntityType } from "../../shared/types/baseCreateEntityType";
import { injectable } from "inversify";
import {
    DeleteKeyStoreDTO,
    UpdateKeyStoreDTO,
} from "../../application/dtos/keystore.dto";

@injectable()
export class KeyStoreRepoImpl implements IKeyStoreRepository {
    private _prisma: PrismaClient;
    constructor() {
        this._prisma = new PrismaClient();
    }

    findAll(): Promise<KeyStore[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<KeyStore | null> {
        throw new Error("Method not implemented.");
    }
    async create(data: any): Promise<any> {
        return await this._prisma.keyStore.create({
            data: data,
        });
    }

    async update({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }: UpdateKeyStoreDTO): Promise<any> {
        return await this._prisma.keyStore.update({
            where: {
                userId: userId,
            },
            data: {
                publicKey: publicKey,
                privateKey: privateKey,
                refreshToken: refreshToken,
            },
        });
    }

    async delete(data: DeleteKeyStoreDTO): Promise<any> {
        return await this._prisma.keyStore.delete({
            where: {
                id: data.id,
                userId: data.userId,
            },
        });
    }

    async findByUserId(userId: number): Promise<KeyStore | null> {
        const keyStore: KeyStore[] = await this._prisma
            .$queryRaw`SELECT * FROM keystores WHERE "userId"=${userId}`;

        return keyStore.length > 0 ? keyStore[0] : null;
    }
}
