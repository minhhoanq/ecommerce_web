import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { HEADER } from "../../shared/types/headerRequest";
import {
    AuthFailureError,
    NotFoundError,
} from "../../shared/core/error.response";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/constants/types";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import crypto from "crypto";

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

    async authentication(req: Request, res: Response, next: NextFunction) {
        /*
            1 - check userid missing ???
            2 - get AT
            3 - verify token
            4 - check user in dbs
            5 - check keystore with this userid
            6 - ok => return next()
        */

        const userId: any = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new AuthFailureError("Invalid request!");

        //check keystore
        const keyStore = await this._keyStoreRepo.findByUserId(userId);
        if (!keyStore) throw new NotFoundError("Not found Keystore!");
        //verify token
        if (req.headers[HEADER.REFRESHTOKEN]) {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;
            try {
                const decodeUser = <TokenData>(
                    await JWT.verify(refreshToken, keyStore.publicKey)
                );
                if (userId !== decodeUser.userId)
                    throw new AuthFailureError("Invalid User");
                req.keyStore = keyStore;
                req.user = decodeUser;
                req.refreshToken = refreshToken as string;
            } catch (error) {
                throw error;
            }
        }
        const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
        if (!accessToken) throw new AuthFailureError("Invalid Access token!");
        try {
            const decodeUser = <TokenData>(
                await JWT.verify(accessToken, keyStore.publicKey)
            );
            if (userId !== decodeUser.userId)
                throw new AuthFailureError("Invalid userId");
            req.keyStore = keyStore;
            req.user = decodeUser;
        } catch (error) {
            throw error;
        }
    }
}
