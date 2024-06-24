import { KeyStore } from "../entities/keyStore";
import IBaseRepository from "./base.interface";

export interface IKeyStoreRepository extends IBaseRepository<KeyStore> {
    create(data: any): Promise<any>;
}
