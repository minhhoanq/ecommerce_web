import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import {
    CodeVerifyDTO,
    CreateUserDTO,
    ResetPasswordDTO,
    SigninDTO,
} from "../../dtos/user.dto";

export default interface IAuthService {
    signup(user: CreateUserDTO): Promise<boolean>;
    finalSignup(
        codeVerify: CodeVerifyDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signin(
        user: SigninDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signout(keyToken: any): Promise<boolean>;
    refreshToken(
        refreshToken: string,
        user: any,
        keyStore: any
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    forgotPassword(body: { email: string }): Promise<boolean>;
    resetPassword(body: ResetPasswordDTO): Promise<any>;
}
