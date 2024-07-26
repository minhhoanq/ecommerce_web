export interface IOrderService {
    checkout(userId: number, payload: any): Promise<any>;
    order(userId: number, payload: any): Promise<any>;
    createPayment(userId: number, payload: any): Promise<any>;
    getOrderDetail(userId: number, orderId: number): Promise<any>;
    getOrders(userId: number): Promise<any>;
    checkInfoFeedback(data: {
        userId: number;
        orderItemId: number;
    }): Promise<any>;
    SubscribeEvents(payload: { event: string; data: any }): Promise<any>;
}
