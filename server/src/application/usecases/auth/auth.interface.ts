import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import { CodeVerifyDTO, CreateUserDTO, SigninDTO } from "../../dtos/user.dto";

export default interface IAuthService {
    signup(user: CreateUserDTO): Promise<boolean>;
    finalSignup({
        codeVerify,
    }: {
        codeVerify: CodeVerifyDTO;
    }): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signin(
        user: SigninDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signout(): Promise<User>;
    refreshToken(): Promise<Tokens>;
}
