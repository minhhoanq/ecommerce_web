import { inject, injectable } from "inversify";
import "reflect-metadata";
import User from "../../../domain/entities/user";
import { Tokens } from "../../../shared/types/tokens";
import { IAuthService } from "./auth.interface";
import { TYPES } from "../../../shared/constants/types";
import { IUserRepository } from "../../../domain/repositories/user.interface";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../../../shared/core/error.response";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IKeyStoreService } from "../keystore/keystore.interface";
import sendMail from "../../../shared/utils/httpStatusCode/sendMail";
import makeVerification from "uniqid";
import { ConfirmSignup } from "../../../shared/utils/templateHtml/confirmSignup";
import schedule from "node-schedule";
import {
    CodeVerifyDTO,
    CreateUserDTO,
    SigninDTO,
    UpdateUserDTO,
} from "../../dtos/user.dto";
import { ConfirmResetPassword } from "../../../shared/utils/templateHtml/confirmResetPassword";
import {
    createPasswordChangedToken,
    createTokensPair,
} from "../../../shared/utils/auth";

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

    async getAllUsers(): Promise<any[]> {
        return await this._userRepo.findAll();
    }

    async me(body: { userId: number }): Promise<User | null> {
        const { userId } = body;
        const user: User | null = await this._userRepo.findById(userId);
        console.log("userId", user);

        return user;
    }

    async signup(user: CreateUserDTO): Promise<boolean> {
        // check user exist
        const { email, username, password, firstName, lastName } = user;
        const userExist = await this._userRepo.findByEmail(email);
        if (userExist) throw new BadRequestError("User already signin!");
        const passwordHash = await bcrypt.hash(password, 10);

        const verificationCode = makeVerification();
        const emailEdited = btoa(email) + "@" + verificationCode;

        console.log(emailEdited);

        const newUser = await this._userRepo.create({
            username,
            firstName,
            lastName,
            password: passwordHash,
            email: emailEdited,
            roleId: 2,
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
                await this._userRepo.deleteByEmail(emailEdited);
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

    async finalSignup(
        body: CodeVerifyDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null> {
        console.log(body);
        const userExist = await this._userRepo.findByCodeVerify(body);

        if (!userExist)
            throw new AuthFailureError(
                "The data is invalid or you have timed out"
            );

        userExist.email = atob(userExist.email.split("@")[0]);
        console.log(userExist.email, userExist.id);

        const updateUser = await this._userRepo.update(userExist.id, {
            email: userExist.email,
        });
        if (!updateUser) throw new BadRequestError("Error!");

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey });

        const publicKeyString = await this._keyStoreService.createKeyStore({
            userId: userExist.id,
            publicKey: publicKey,
            privateKey: privateKey,
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
            publicKeyString.publicKey,
            publicKeyString.privateKey
        );

        console.log("tokens: ", tokens);
        await this._keyStoreService.updateKeyStore({
            userId: userExist.id,
            refreshToken: tokens?.refreshToken,
        });

        return {
            user: userExist,
            tokens,
        };
    }

    async signin(
        user: SigninDTO
    ): Promise<{ user: User; tokens: Tokens | undefined } | null> {
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
            await this._keyStoreService.updateKeyStore({
                userId: userExist.id,
                publicKey,
                privateKey,
            });
        } else {
            await this._keyStoreService.createKeyStore({
                userId: userExist.id,
                publicKey: publicKey,
                privateKey: privateKey,
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

        await this._keyStoreService.updateKeyStore({
            userId: userExist.id,
            refreshToken: tokens?.refreshToken,
        });

        return {
            user: userExist,
            tokens,
        };
    }

    async signout(keyToken: any): Promise<boolean> {
        const deleteKeyToke = await this._keyStoreService.deleteKeyStore(
            keyToken.id
        );
        console.log(deleteKeyToke);
        return true;
    }

    async refreshToken(
        refreshToken: string,
        user: any,
        keyStore: any
    ): Promise<{ user: User; tokens: Tokens | undefined } | null> {
        const { userId, email, roleId } = user;
        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("User not signup!");

        const foundUser = await this._userRepo.findByEmail(email);
        if (!foundUser) throw new AuthFailureError("User not signup!");
        //create tokens
        const tokens = await createTokensPair(
            { userId, email, roleId },
            keyStore.publicKey,
            keyStore.privateKey
        );

        await this._keyStoreService.updateKeyStore({
            userId,
            refreshToken: tokens?.refreshToken,
        });

        //refreshToken cu bo vo session check trung refreshToken

        return {
            user: user,
            tokens: tokens,
        };
    }

    //forgot password
    async forgotPassword(body: { email: string }): Promise<boolean> {
        const { email } = body;
        console.log(email);
        if (!email) throw new BadRequestError("Missing email!");
        const user = await this._userRepo.findByEmail(email);
        if (!user) throw new NotFoundError("User not found!");

        const passwordTokens = createPasswordChangedToken();

        console.log(passwordTokens);

        const updateUser = await this._userRepo.update(user.id, {
            passwordResetToken: passwordTokens.passwordResetToken,
            passwordResetExpires: passwordTokens.passwordResetExpires,
        });

        if (updateUser) {
            const time = Date.now();
            const date = new Date(time);

            // const delete passwordResetToken
            const delPasswordResetToken = async () =>
                await this._userRepo.update(user.id, {
                    passwordResetToken: "",
                    passwordResetExpires: "",
                });

            console.log(date.getTime());
            schedule.scheduleJob(
                date.getTime() + 5 * 60 * 1000,
                async function () {
                    delPasswordResetToken();
                }
            );

            const html = ConfirmResetPassword(passwordTokens.resetToken);
            const payload = {
                email: user.email,
                html,
                subject: "Reset password!",
            };

            await sendMail(payload);

            return true;
        }

        return false;
    }

    //reset password
    async resetPassword(body: {
        password: string;
        token: string;
    }): Promise<any> {
        const { password, token } = body;
        if (!password || !token) throw new BadRequestError("Missing data!");

        const passwordResetToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        console.log(passwordResetToken);

        const dateNow = Date.now();

        const user = await this._userRepo.findFirst({
            passwordResetToken: passwordResetToken,
            passwordResetExpires: String(dateNow),
        });

        if (!user)
            throw new AuthFailureError(
                "The data is invalid or you have timed out"
            );
        console.log(user);

        const passwordHash = await bcrypt.hash(password, 10);

        const updateUser = await this._userRepo.update(user.id, {
            password: passwordHash,
            passwordResetToken: "",
            passwordChangedAt: Date.now().toString(),
            passwordResetExpires: "",
        });

        return updateUser;
    }

    async update(userId: number, body: UpdateUserDTO): Promise<User> {
        console.log("body", body);
        return await this._userRepo.update(userId, body);
    }
}
