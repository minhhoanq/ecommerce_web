import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import "reflect-metadata";
import { HEADER } from "../../shared/types/headerRequest";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../../shared/core/error.response";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/constants/types";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import crypto from "crypto";
import { asyncHandler } from "../../shared/helpers/asyncHandler";

export interface TokenData {
    userId: number;
    roleId: number;
    shopId: number;
}

@injectable()
export class Auth {
    private _keyStoreRepo: IKeyStoreRepository;
    constructor(
        @inject(TYPES.KeyStoreRepository)
        keyStoreRepo: IKeyStoreRepository
    ) {
        this._keyStoreRepo = keyStoreRepo;
    }

    authentication = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            /*
                1 - check userid missing ???
                2 - get AT
                3 - verify token
                4 - check user in dbs
                5 - check keystore with this userid
                6 - ok => return next()
            */

            const userId = parseInt(
                req.headers[HEADER.CLIENT_ID] as string,
                10
            );
            if (!userId) throw new AuthFailureError("Invalid request!");
            //check keystore
            const keyStore = await this._keyStoreRepo.findByUserId(
                userId as number
            );
            if (!keyStore) throw new NotFoundError("Not found Keystore!");
            //verify token
            if (req.headers[HEADER.REFRESHTOKEN]) {
                const token = req.headers[HEADER.REFRESHTOKEN] as string;
                const refreshToken = token.split(" ")[1];
                try {
                    const decodeUser = <TokenData>(
                        await JWT.verify(refreshToken, keyStore.privateKey)
                    );
                    if (userId !== decodeUser.userId)
                        throw new AuthFailureError("Invalid User");
                    req.keyStore = keyStore;
                    req.user = decodeUser;
                    req.refreshToken = refreshToken as string;
                    return next();
                    // return res.status(200).json({
                    //     keyStore,
                    //     decodeUser,
                    //     refreshToken,
                    // });
                } catch (error) {
                    throw error;
                }
            }

            const token = req.headers[HEADER.AUTHORIZATION] as string;
            if (!token) throw new AuthFailureError("Invalid token!");
            const accessToken = token.split(" ")[1];
            if (!accessToken)
                throw new AuthFailureError("Invalid Access token!");
            try {
                const decodeUser = <TokenData>(
                    await JWT.verify(accessToken, keyStore.publicKey)
                );

                if (userId !== decodeUser.userId)
                    throw new AuthFailureError("Invalid User");
                req.keyStore = keyStore;
                req.user = decodeUser;
                return next();

                // return res.status(200).json({
                //     authen: {
                //         keyStore,
                //         decodeUser,
                //     },
                // });
            } catch (error) {
                throw error;
            }
        }
    );
}
