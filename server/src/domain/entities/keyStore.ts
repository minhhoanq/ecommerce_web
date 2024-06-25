export class KeyStore {
    constructor(
        public id: number,
        public userId: number,
        public publicKey: string,
        public refreshToken: string | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}
}
