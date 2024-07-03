export interface ICartService {
    createCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any>;
    addToCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any>;
}
