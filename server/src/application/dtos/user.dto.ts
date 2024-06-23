import { z, TypeOf } from "zod";

export const userIdSchema = z.object({
    id: z.number({ required_error: "id is required!" }),
});

export const userBodySchema = {
    email: z.string({ required_error: "email is required" }),
    password: z.string({ required_error: "password is required" }),
    username: z.string({ required_error: "name is required" }),
    phoneNumber: z.string({ required_error: "phoneNumber is required" }),
    role: z.number({ required_error: "role is required" }),
};

export const createUserSchema = z.object({
    body: z.object(userBodySchema),
});

export type CreateUserDTO = TypeOf<typeof createUserSchema>["body"];

export const updateUserSchema = z.object({
    params: userIdSchema,
    body: z.object(userBodySchema).partial(),
});

export type UpdateUserDTO = TypeOf<typeof updateUserSchema>["body"];
