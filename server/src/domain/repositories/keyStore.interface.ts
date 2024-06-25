import { KeyStore } from "../entities/keyStore";
import IBaseRepository from "./base.interface";

export interface IKeyStoreRepository extends IBaseRepository<KeyStore> {
    create(data: any): Promise<any>;
    findByUserId(userId: number): Promise<KeyStore | null>;
    update(userId: number, publicKey: string): Promise<any>;
}
