import { ProductService } from "./product.service";

export class SmartPhoneService extends ProductService {
    private colorId: number;
    private ramId: number;
    private internalId: number;
    constructor(
        name: string,
        slug: string,
        desc: string,
        originalPrice: number,
        categoryId: number,
        brandId: number,
        isDraft: boolean,
        isPublished: boolean,
        releaseDate: Date | null,
        colorId: number,
        ramId: number,
        intervalId: number,
        createdAt: Date | null,
        updatedAt: Date | null
    ) {
        super(
            name,
            slug,
            desc,
            originalPrice,
            categoryId,
            brandId,
            isDraft,
            isPublished,
            releaseDate,
            createdAt,
            updatedAt
        );
        this.colorId = colorId;
        this.ramId = ramId;
        this.internalId = intervalId;
    }

    async createProduct(): Promise<any> {
        const newSmartPhone = "smart phone"; //create product
        console.log("check");
        const newProduct = await super.createProduct(1);

        return {
            newSmartPhone,
            newProduct,
        };
    }
}
