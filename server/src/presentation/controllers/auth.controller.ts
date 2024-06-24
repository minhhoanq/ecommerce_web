import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../shared/constants/types";
import IAuthService from "../../application/usecases/auth/auth.interface";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../shared/core/success.response";

@injectable()
export default class AuthController {
    private _authService: IAuthService;

    constructor(
        @inject(TYPES.AuthService)
        authService: IAuthService
    ) {
        this._authService = authService;
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.signup(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
