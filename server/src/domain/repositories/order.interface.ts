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
    updateStatus(
        userId: number,
        orderId: number,
        orderStatusId: number
    ): Promise<any>;
    delete(userId: number, orderId: number): Promise<any>;
    findFirst(userId: number, orderId: number): Promise<any>;
    findMany(userId: number, query: any): Promise<any>;
    findFirstOrderItem(orderItemId: number): Promise<any>;
    getStatistical(): Promise<any>;
    findAllOrders(): Promise<any>;
}
