import { NextFunction, Request, Response } from "express";

export const middle = () => {
    (req: Request, res: Response, next: NextFunction) => {
        const { authen } = req.body;

        if (authen) {
            req.user = authen.decodeUser;
            req.keyStore = authen.keyStore;
            return next();
        } else {
            throw "Error";
        }
    };
};
