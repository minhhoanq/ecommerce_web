export interface IOrderService {
    checkout(userId: number, payload: any): Promise<any>;
    order(userId: number, payload: any): Promise<any>;
    // getOrderDetail(userId: number, payload: any): Promise<any>;
}
