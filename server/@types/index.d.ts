declare module Express {
    export interface Request {
        user?: any;
        keyStore?: any;
        refreshToken?: string;
    }
}
