import slugify from "slugify";

export class Product {
    public name: string;
    public slug: string;
    public desc: string;
    public originalPrice: number;
    public salePrice: number;
    public categoryId: number;
    public brandId: number;
    public isDraft: boolean;
    public isPublished: boolean;
    public releaseDate: Date | null;
    public createdAt: Date | null;
    public updatedAt: Date | null;

    constructor(
        name: string,
        desc: string,
        originalPrice: number,
        salePrice: number,
        categoryId: number,
        brandId: number,
        isDraft: boolean,
        isPublished: boolean,
        releaseDate: Date | null,
        createdAt: Date | null,
        updatedAt: Date | null
    ) {
        (this.name = name),
            (this.slug = slugify(this.name, { lower: true })),
            (this.desc = desc),
            (this.originalPrice = originalPrice),
            (this.salePrice = salePrice),
            (this.categoryId = categoryId),
            (this.brandId = brandId),
            (this.isDraft = isDraft),
            (this.isPublished = isPublished),
            (this.releaseDate = releaseDate),
            (this.createdAt = createdAt),
            (this.updatedAt = updatedAt);
    }
}

export class SmartPhone extends Product {
    private colorId: number;
    private ramId: number;
    private internalId: number;

    constructor(
        name: string,
        desc: string,
        originalPrice: number,
        salePrice: number,
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
            desc,
            originalPrice,
            salePrice,
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
}
