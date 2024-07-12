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
}
