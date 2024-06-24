import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import { CodeVerifyDTO, CreateUserDTO } from "../../dtos/user.dto";

export default interface IAuthService {
    signup(user: CreateUserDTO): Promise<boolean>;
    finalSignup({
        codeVerify,
    }: {
        codeVerify: CodeVerifyDTO;
    }): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signin(): Promise<User>;
    signout(): Promise<User>;
    refreshToken(): Promise<Tokens>;
}
