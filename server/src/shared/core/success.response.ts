import { Response } from "express";
import { reasonPhrases, statusCode } from "../utils/httpStatusCode";

class SuccessResponse {
    private message;
    private status;
    private reasonStatusCode;
    private metadata;

    constructor({
        message,
        statuscode = statusCode["OK"],
        reasonStatusCode = reasonPhrases["OK"],
        metadata,
    }: Record<string, any>) {
        (this.status = statuscode), (this.reasonStatusCode = reasonStatusCode);
        this.message = message ? message : reasonStatusCode;
        this.metadata = metadata;
    }

    send(res: Response, headers?: any) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }: Record<string, any>) {
        super({ message, metadata });
    }
}

class Created extends SuccessResponse {
    constructor({
        message,
        statuscode = statusCode["CREATED"],
        reasonStatusCode = reasonPhrases["CREATED"],
        metadata,
    }: Record<string, any>) {
        super({ message, statuscode, reasonStatusCode, metadata });
    }
}

export { OK, Created, SuccessResponse };
