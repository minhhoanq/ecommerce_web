import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../shared/constants/types";
import IAuthService from "../../application/usecases/auth/auth.interface";
import { NextFunction, Request, Response } from "express";

@injectable()
export default class AuthController {
    private _authService: IAuthService;

    constructor(
        @inject(TYPES.AuthService)
        authService: IAuthService
    ) {
        this._authService = authService;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json("Check");
        } catch (error) {
            next(error);
        }
    }
}
