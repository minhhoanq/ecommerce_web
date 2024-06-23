import User from "../../domain/entities/user";
import { Tokens } from "../../shared/types/tokens";
import IAuthService from "./auth.interface";

export class AuthService implements IAuthService {
    signup(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    signin(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    signout(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    refreshToken(): Promise<Tokens> {
        throw new Error("Method not implemented.");
    }
}
