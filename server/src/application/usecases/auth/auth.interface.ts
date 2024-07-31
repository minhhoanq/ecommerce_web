import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import {
    CodeVerifyDTO,
    CreateUserDTO,
    ResetPasswordDTO,
    SigninDTO,
    UpdateUserDTO,
} from "../../dtos/user.dto";

export interface IAuthService {
    getAllUsers(): Promise<any[]>;
    me(body: { userId: number }): Promise<User | null>;
    signup(user: CreateUserDTO): Promise<boolean>;
    finalSignup(
        codeVerify: CodeVerifyDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signin(
        user: SigninDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signout(keyToken: any): Promise<boolean>;
    update(userId: number, body: UpdateUserDTO): Promise<User>;
    refreshToken(
        refreshToken: string,
        user: any,
        keyStore: any
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    forgotPassword(body: { email: string }): Promise<boolean>;
    resetPassword(body: ResetPasswordDTO): Promise<any>;
}
