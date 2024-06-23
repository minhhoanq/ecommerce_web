import User from "../../domain/entities/user";
import { Tokens } from "../../shared/types/tokens";

export default interface IAuthService {
    signup(): Promise<User>;
    signin(): Promise<User>;
    signout(): Promise<User>;
    refreshToken(): Promise<Tokens>;
}
