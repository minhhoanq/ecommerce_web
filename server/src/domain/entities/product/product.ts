export class Product {
    private name: string;
    private slug: string;
    private desc: string;
    private originalPrice: number;
    private categoryId: number;
    private brandId: number;
    private isDraft: boolean;
    private isPublished: boolean;
    private releaseDate: Date | null;
    private createdAt: Date | null;
    private updatedAt: Date | null;
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
        createdAt: Date | null,
        updatedAt: Date | null
    ) {
        (this.name = name),
            (this.slug = slug),
            (this.desc = desc),
            (this.originalPrice = originalPrice),
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
}
