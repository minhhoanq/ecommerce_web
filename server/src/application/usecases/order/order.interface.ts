export interface IOrderService {
    checkout(userId: number, payload: any): Promise<any>;
    order(userId: number, payload: any): Promise<any>;
    updateOrderStatus(
        userId: number,
        orderId: number,
        orderStatusId: number
    ): Promise<any>;
    createPayment(userId: number, payload: any): Promise<any>;
    eventWebhooks(signature: string, payload: any): Promise<any>;
    getOrderDetail(userId: number, orderId: number): Promise<any>;
    getOrders(userId: number, query: any): Promise<any>;
    checkInfoFeedback(data: {
        userId: number;
        orderItemId: number;
    }): Promise<any>;
    SubscribeEvents(payload: { event: string; data: any }): Promise<any>;
    getStatistical(): Promise<any>;
    getAllOrders(query: any): Promise<any>;
}
