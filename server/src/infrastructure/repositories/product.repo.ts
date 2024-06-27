import { injectable } from "inversify";
import { IProductRepository } from "../../domain/repositories/product.interface";

@injectable()
export class ProductReponsitoryImpl implements IProductRepository {
    create(payload: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    createProductChildren(payload: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
