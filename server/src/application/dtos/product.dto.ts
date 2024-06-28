import { z } from "zod";

// const queryProducts = z.object({
//     limit: z.number(),
//     sort: z.string(),
//     page: z.number(),
//     filter:
// });
const productSchema = z.object({
    type: z.string(),
    name: z.string(),
    desc: z.string(),
    originalPrice: z.number(),
    categoryId: z.number(),
    brandId: z.number(),
    releaseDate: z.date(),
    colorId: z.number(),
    ramId: z.number(),
    internalId: z.number(),
    salePrice: z.number(),
});

type ProductDTO = z.infer<typeof productSchema>;

export { productSchema, ProductDTO };
