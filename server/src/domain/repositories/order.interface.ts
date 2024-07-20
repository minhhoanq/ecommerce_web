export interface IOrderRepository {
    create(
        userId: number,
        paymentMethod: number,
        addressId: number,
        total: number,
        payload: [
            {
                id: number;
                quantity: number;
                salePrice: number;
            }
        ]
    ): Promise<any>;

    findFirst(userId: number, orderId: number): Promise<any>;
    findMany(userId: number): Promise<any>;
    findFirstOrderItem(orderItemId: number): Promise<any>;
}
