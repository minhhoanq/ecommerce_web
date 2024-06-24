import { inject, injectable } from "inversify";
import "reflect-metadata";
import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import IAuthService from "./auth.interface";
import { TYPES } from "../../../shared/constants/types";
import { IUserRepository } from "../../../domain/repositories/user.interface";
import { BadRequestError } from "../../../shared/core/error.response";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IKeyStoreService } from "../keystore/keystore.interface";
import { createTokensPair } from "../../../domain/auth/auth.util";
import { CreateUserDTO } from "../../dtos/user.dto";

@injectable()
export class AuthService implements IAuthService {
    private _userRepo: IUserRepository;
    private _keyStoreService: IKeyStoreService;

    constructor(
        @inject(TYPES.UserRepository) userRepo: IUserRepository,
        @inject(TYPES.KeyStoreService) keyStoreRepo: IKeyStoreService
    ) {
        this._userRepo = userRepo;
        this._keyStoreService = keyStoreRepo;
    }

    async signup(
        user: CreateUserDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null> {
        //check user exist
        const { email, username, password, roleId } = user;
        const userExist = await this._userRepo.findByEmail(email);
        if (userExist) throw new BadRequestError("User already signin!");
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await this._userRepo.create({
            username,
            password: passwordHash,
            email,
            roleId: 3,
        });

        console.log(newUser);

        if (newUser) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");

            console.log({ publicKey, privateKey });

            const publicKeyString = this._keyStoreService.createKeyStore({
                userId: newUser.id,
                publicKey: publicKey,
            });

            if (!publicKeyString) {
                throw new BadRequestError("Public key string error!");
            }

            const tokens = await createTokensPair(
                {
                    userId: newUser.id,
                    email: newUser.email,
                    roleId: newUser.roleId,
                },
                publicKey,
                privateKey
            );

            console.log("tokens: ", tokens);

            return {
                user: newUser,
                tokens,
            };
        }

        return null;
    }
    signin(): Promise<User> {
        throw new Error("Method not implemented2.");
    }
    signout(): Promise<User> {
        throw new Error("Method not implemented 3.");
    }
    refreshToken(): Promise<Tokens> {
        throw new Error("Method not implemented4.");
    }
}
