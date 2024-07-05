export interface IInventoryRepository {
    revervation(
        productItemId: number,
        quantity: number,
        cartId: number
    ): Promise<any>;
}
