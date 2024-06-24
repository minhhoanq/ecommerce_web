import { KeyStore } from "../../../domain/entities/keyStore";

export interface IKeyStoreService {
    createKeyStore(data: any): Promise<KeyStore>;
}
