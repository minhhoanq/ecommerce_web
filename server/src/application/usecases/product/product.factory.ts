import { SmartPhoneService } from "./smartphone.service";
import { BadRequestError } from "../../../shared/core/error.response";

//Product Factory
// @injectable()
export class ProductFatory {
    static productRegistry: any = {};
    static registerProductType(type: string, classRef: any) {
        this.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: any) {
        const productClass = ProductFatory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError("Invalid product type: " + type);

        return new productClass(
            "hoang",
            "hoang",
            "hoang",
            1,
            1,
            1,
            true,
            false,
            null,
            1,
            1,
            1,
            null,
            null
        ).createProduct();
    }
}

//register product
ProductFatory.registerProductType("Smart Phone", SmartPhoneService);
