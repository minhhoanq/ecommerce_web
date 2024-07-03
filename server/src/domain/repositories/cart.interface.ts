export interface ICartRepository {
    create(userId: number): Promise<any>;
    findByUserId(userId: number): Promise<any>;
}
