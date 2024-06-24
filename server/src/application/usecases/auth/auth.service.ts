import { inject, injectable } from "inversify";
import "reflect-metadata";
import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import IAuthService from "./auth.interface";
import { TYPES } from "../../../shared/constants/types";
import { IUserRepository } from "../../../domain/repositories/user.interface";

@injectable()
export class AuthService implements IAuthService {
    private _userRepo: IUserRepository;

    constructor(@inject(TYPES.UserRepository) userRepo: IUserRepository) {
        this._userRepo = userRepo;
    }

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
