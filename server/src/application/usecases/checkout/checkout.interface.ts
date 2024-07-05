export interface ICheckoutService {
    checkout(userId: number, payload: any): Promise<any>;
    order(
        userId: number,
        addressId: number,
        paymentMethodId: number,
        payload: any
    ): Promise<any>;
}
