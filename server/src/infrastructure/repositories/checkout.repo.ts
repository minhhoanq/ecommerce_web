import { injectable } from "inversify";
import { ICheckoutRepository } from "../../domain/repositories/checkout.interface";

@injectable()
export class CheckoutRepositoryImpl implements ICheckoutRepository {}
