import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import { CreateUserDTO } from "../../dtos/user.dto";

export default interface IAuthService {
    signup(
        user: CreateUserDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null>;
    signin(): Promise<User>;
    signout(): Promise<User>;
    refreshToken(): Promise<Tokens>;
}
