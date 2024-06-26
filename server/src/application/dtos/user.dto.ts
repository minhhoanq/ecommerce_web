import { z } from "zod";

//create user dto
const createUserSchema = z.object({
    firstName: z.string({ required_error: "First name can't empty!" }),
    lastName: z.string({ required_error: "Last name can't empty!" }),
    username: z.string({ required_error: "Username can't empty!" }),
    email: z.string({ required_error: "Email can't empty!" }),
    password: z.string({ required_error: "Password can't empty!" }),
    roleId: z.number({ required_error: "Role id can't empty!" }),
});

type CreateUserDTO = z.infer<typeof createUserSchema>;

//update user dto
const updateUserSchema = z.object({
    username: z.string().optional(),
    firstName: z.string().min(1, "First name is required!").optional(),
    lastName: z.string().min(1, "Last name is required!").optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    avatar: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
    phone: z.number().optional(),
    roleId: z.number().optional(),
    status: z.boolean().optional(),
    isVerify: z.boolean().optional(),
    passwordChangedAt: z.string().optional(),
    passwordResetToken: z.string().optional(),
    passwordResetExpires: z.string().optional(),
});

type UpdateUserDTO = z.infer<typeof updateUserSchema>;

// code verify dto
const codeVerifySchema = z.object({
    token: z.string({ required_error: "Missing code verify!" }),
});

type CodeVerifyDTO = z.infer<typeof codeVerifySchema>;

// sign in
const signinSchema = z.object({
    email: z.string({ required_error: "Email is required!" }),
    password: z.string({ required_error: "Password is required!" }),
});

type SigninDTO = z.infer<typeof signinSchema>;

//reset password
const resetPasswordSchema = z.object({
    password: z.string({ required_error: "Missing password!" }),
    token: z.string({ required_error: "Missing token password!" }),
});

type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;

//find first user
//update user dto
const findFirstUserSchema = z.object({
    id: z.number().optional(),
    username: z.string().optional(),
    firstName: z.string().min(1, "First name is required!").optional(),
    lastName: z.string().min(1, "Last name is required!").optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    avatar: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
    phone: z.number().optional(),
    roleId: z.number().optional(),
    status: z.boolean().optional(),
    isVerify: z.boolean().optional(),
    passwordChangedAt: z.string().optional(),
    passwordResetToken: z.string().optional(),
    passwordResetExpires: z.string().optional(),
});

type FindFirstUserDTO = z.infer<typeof findFirstUserSchema>;

export {
    createUserSchema,
    CreateUserDTO,
    updateUserSchema,
    UpdateUserDTO,
    codeVerifySchema,
    CodeVerifyDTO,
    signinSchema,
    SigninDTO,
    resetPasswordSchema,
    ResetPasswordDTO,
    findFirstUserSchema,
    FindFirstUserDTO,
};
