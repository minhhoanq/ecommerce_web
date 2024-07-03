export interface ICartService {
    createCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any>;
    addToCart(
        userId: number,
        payload: { productItemId: number; quantity: number }
    ): Promise<any>;

    updateToCart(
        userId: number,
        payload: {
            productItemId: number;
            quantity: number;
            oldQuantity: number;
        }
    ): Promise<any>;

    deteleCartItem(
        userId: number,
        body: { productItemId: number }
    ): Promise<any>;

    getCartItems(userId: number): Promise<any>;
}
