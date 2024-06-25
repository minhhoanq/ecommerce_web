import { KeyStore } from "../../../domain/entities/keyStore";

export interface IKeyStoreService {
    createKeyStore(data: any): Promise<KeyStore>;
    findKeyStrore(userId: number): Promise<KeyStore | null>;
    updateKeyStore(userId: number, publicKey: string): Promise<any>;
}
