import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../shared/constants/types";
import { IAuthService } from "../../application/usecases/auth/auth.interface";
import { NextFunction, Request, Response } from "express";
import { Created, SuccessResponse } from "../../shared/core/success.response";

@injectable()
export class AuthController {
    private _authService: IAuthService;

    constructor(
        @inject(TYPES.AuthService)
        authService: IAuthService
    ) {
        this._authService = authService;
    }

    async me(req: Request, res: Response, next: NextFunction) {
        console.log("Vo day ko");

        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.me(req.user),
            }).send(res);
        } catch (error) {
            next(error);
        }
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

    async finalSignup(req: Request, res: Response, next: NextFunction) {
        try {
            new Created({
                message: "CREATED!",
                metadata: await this._authService.finalSignup(
                    req.params as { token: string }
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.signin(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.forgotPassword(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.resetPassword(req.body),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        console.log("vo day ko vay");

        try {
            new SuccessResponse({
                message: "OK!",
                metadata: await this._authService.update(
                    req.user.userId,
                    req.body
                ),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
