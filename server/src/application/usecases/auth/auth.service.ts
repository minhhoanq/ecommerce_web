import { inject, injectable } from "inversify";
import "reflect-metadata";
import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import IAuthService from "./auth.interface";
import { TYPES } from "../../../shared/constants/types";
import { IUserRepository } from "../../../domain/repositories/user.interface";
import {
    AuthFailureError,
    BadRequestError,
} from "../../../shared/core/error.response";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IKeyStoreService } from "../keystore/keystore.interface";
import { createTokensPair } from "../../../domain/auth/auth.util";
import { CodeVerifyDTO, CreateUserDTO } from "../../dtos/user.dto";
import sendMail from "../../../shared/utils/httpStatusCode/sendMail";
import makeVerification from "uniqid";
import { ConfirmSignup } from "../../../shared/utils/templateHtml/confirmSignup";
import schedule from "node-schedule";

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

    async signup(user: CreateUserDTO): Promise<boolean> {
        // check user exist
        const { email, username, password, roleId } = user;
        const userExist = await this._userRepo.findByEmail(email);
        if (userExist) throw new BadRequestError("User already signin!");
        const passwordHash = await bcrypt.hash(password, 10);

        const verificationCode = makeVerification();
        const emailEdited = btoa(email) + "@" + verificationCode;

        console.log(emailEdited);

        const newUser = await this._userRepo.create({
            username,
            password: passwordHash,
            email: emailEdited,
            roleId: 3,
        });

        console.log(newUser);

        if (newUser) {
            const html = ConfirmSignup(verificationCode);
            const data = {
                email,
                html,
                subject: "Register with email!",
            };

            await sendMail(data);

            const time = Date.now();
            const date = new Date(time);

            const deleteUser = async () => {
                await this._userRepo.delete(newUser.id);
            };

            console.log(date.getTime());
            schedule.scheduleJob(
                date.getTime() + 5 * 60 * 1000,
                async function () {
                    deleteUser();
                }
            );

            return true;
        }

        return false;
    }

    async finalSignup({
        codeVerify,
    }: {
        codeVerify: CodeVerifyDTO;
    }): Promise<{ user: User; tokens: Tokens | undefined } | null> {
        console.log(codeVerify);
        const userExist = await this._userRepo.findByCodeVerify(codeVerify);

        if (!userExist)
            throw new AuthFailureError(
                "The data is invalid or you have timed out"
            );

        userExist.email = atob(userExist.email.split("@")[0]);
        console.log(userExist.email, userExist.id);

        const updateUser = await this._userRepo.update(
            userExist.id,
            userExist.email
        );
        if (!updateUser) throw new BadRequestError("Error!");

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey });

        const publicKeyString = await this._keyStoreService.createKeyStore({
            userId: userExist.id,
            publicKey: publicKey,
        });

        if (!publicKeyString) {
            throw new BadRequestError("Public key string error!");
        }

        const tokens = await createTokensPair(
            {
                userId: userExist.id,
                email: userExist.email,
                roleId: userExist.roleId,
            },
            publicKey,
            privateKey
        );

        console.log("tokens: ", tokens);

        return {
            user: userExist,
            tokens,
        };
    }

    async signin(user: {
        email: string;
        password: string;
    }): Promise<{ user: User; tokens: Tokens | undefined } | null> {
        const { email, password } = user;
        //check user exist
        const userExist = await this._userRepo.findByEmail(email);
        if (!userExist) throw new BadRequestError("User not signup !");

        //check match password
        const macth = await bcrypt.compare(password, userExist.password);
        if (!macth) throw new AuthFailureError("Incorrect password!");

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey });

        const keyStore = await this._keyStoreService.findKeyStrore(
            userExist.id
        );

        console.log(keyStore);

        // const

        if (keyStore) {
            await this._keyStoreService.updateKeyStore(userExist.id, publicKey);
        } else {
            await this._keyStoreService.createKeyStore({
                userId: userExist.id,
                publicKey: publicKey,
            });
        }

        const tokens = await createTokensPair(
            {
                userId: userExist.id,
                email: userExist.email,
                roleId: userExist.roleId,
            },
            publicKey,
            privateKey
        );

        return {
            user: userExist,
            tokens,
        };
    }

    signout(): Promise<User> {
        throw new Error("Method not implemented 3.");
    }

    refreshToken(): Promise<Tokens> {
        throw new Error("Method not implemented4.");
    }
}
