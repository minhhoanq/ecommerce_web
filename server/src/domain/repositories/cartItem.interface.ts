export interface ICartItemRepository {
    create(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any>;
    findByCartId(cartId: number): Promise<any>;
    update(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any>;
}
