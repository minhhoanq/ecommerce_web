export interface IOrderRepository {
    create(
        userId: number,
        paymentMethod: number,
        addressId: number,
        date: Date,
        total: number,
        payload: [
            {
                productItemId: number;
                quantity: number;
                price: number;
            }
        ]
    ): Promise<any>;
}
