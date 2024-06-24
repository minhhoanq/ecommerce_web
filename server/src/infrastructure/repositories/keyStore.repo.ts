import { PrismaClient } from "@prisma/client";
import { KeyStore } from "../../domain/entities/keyStore";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import { BaseCreateEntityType } from "../../shared/types/baseCreateEntityType";
import { injectable } from "inversify";

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
    update(id: number): Promise<KeyStore> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<KeyStore> {
        throw new Error("Method not implemented.");
    }
}
