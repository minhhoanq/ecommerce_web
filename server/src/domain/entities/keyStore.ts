export class KeyStore {
    constructor(
        public id: number,
        public userId: number,
        public publicKey: string,
        public refreshToken: string,
        public createdAt: string,
        public updatedAt: string
    ) {}
}
