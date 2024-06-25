import { inject, injectable } from "inversify";
import "reflect-metadata";
import { KeyStore } from "../../../domain/entities/keyStore";
import { IKeyStoreService } from "./keystore.interface";
import { IKeyStoreRepository } from "../../../domain/repositories/keyStore.interface";
import { TYPES } from "../../../shared/constants/types";

@injectable()
export class KeyStoreService implements IKeyStoreService {
    private _keyStoreRepo: IKeyStoreRepository;

    constructor(
        @inject(TYPES.KeyStoreRepository) keyStore: IKeyStoreRepository
    ) {
        this._keyStoreRepo = keyStore;
    }

    async createKeyStore(data: any): Promise<KeyStore> {
        return await this._keyStoreRepo.create(data);
    }

    async findKeyStrore(userId: number): Promise<KeyStore | null> {
        return await this._keyStoreRepo.findByUserId(userId);
    }

    async updateKeyStore(userId: number, publicKey: string): Promise<any> {
        return await this._keyStoreRepo.update(userId, publicKey);
    }
}
