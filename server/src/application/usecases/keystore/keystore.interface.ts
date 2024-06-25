import { KeyStore } from "../../../domain/entities/keyStore";
import {
    CreateKeyStoreDTO,
    DeleteKeyStoreDTO,
    UpdateKeyStoreDTO,
} from "../../dtos/keystore.dto";

export interface IKeyStoreService {
    createKeyStore(data: CreateKeyStoreDTO): Promise<KeyStore>;
    findKeyStrore(userId: number): Promise<KeyStore | null>;
    updateKeyStore(data: UpdateKeyStoreDTO): Promise<any>;
    deleteKeyStore(body: DeleteKeyStoreDTO): Promise<boolean>;
}
