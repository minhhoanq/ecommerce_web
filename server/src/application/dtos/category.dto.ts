import { z } from "zod";

const categoryCreateSchema = z.object({
    name: z.string(),
});

type CategoryCreateDTO = z.infer<typeof categoryCreateSchema>;

const categoryUpdateSchema = z.object({
    id: z.number(),
    name: z.string(),
});

type CategoryUpdateDTO = z.infer<typeof categoryUpdateSchema>;

export {
    categoryCreateSchema,
    CategoryCreateDTO,
    categoryUpdateSchema,
    CategoryUpdateDTO,
};
