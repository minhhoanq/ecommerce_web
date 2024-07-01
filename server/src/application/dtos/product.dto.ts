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

//update product
const updateProductSchema = z.object({
    type: z.string(),
    name: z.string().optional(),
    desc: z.string().optional(),
    originalPrice: z.number().optional(),
    categoryId: z.number().optional(),
    brandId: z.number().optional(),
    releaseDate: z.date().optional(),
    colorId: z.number().optional(),
    ramId: z.number().optional(),
    internalId: z.number().optional(),
    salePrice: z.number().optional(),
});

type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export { productSchema, ProductDTO, updateProductSchema, UpdateProductDTO };
