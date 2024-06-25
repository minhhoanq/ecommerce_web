import {
    DeleteKeyStoreDTO,
    UpdateKeyStoreDTO,
} from "../../application/dtos/keystore.dto";
import { KeyStore } from "../entities/keyStore";
import IBaseRepository from "./base.interface";

export interface IKeyStoreRepository extends IBaseRepository<KeyStore> {
    create(data: any): Promise<any>;
    findByUserId(userId: number): Promise<KeyStore | null>;
    update(data: UpdateKeyStoreDTO): Promise<any>;
    delete(body: DeleteKeyStoreDTO): Promise<any>;
}
