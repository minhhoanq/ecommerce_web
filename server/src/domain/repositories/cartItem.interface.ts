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
    updateQty(payload: {
        cartId: number;
        productItemId: number;
        quantity: number;
    }): Promise<any>;
    delete(userId: number, productItemId: number): Promise<any>;
    findByUserId(userId: number): Promise<any>;
}
