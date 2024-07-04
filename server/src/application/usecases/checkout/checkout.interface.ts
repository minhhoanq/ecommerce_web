export interface ICheckoutService {
    checkout(userId: number, payload: any): Promise<any>;
}
