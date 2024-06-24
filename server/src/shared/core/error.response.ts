import { reasonPhrases, statusCode } from "../utils/httpStatusCode";

class ErrorResponse extends Error {
    private status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = reasonPhrases["CONFLICT"],
        status = statusCode["CONFLICT"]
    ) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = reasonPhrases["BAD_REQUEST"],
        status = statusCode["BAD_REQUEST"]
    ) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = reasonPhrases["FORBIDDEN"],
        status = statusCode["FORBIDDEN"]
    ) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = reasonPhrases["FORBIDDEN"],
        status = statusCode["FORBIDDEN"]
    ) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = reasonPhrases["NOT_FOUND"],
        status = statusCode["NOT_FOUND"]
    ) {
        super(message, status);
    }
}

class Unauthorized extends ErrorResponse {
    constructor(
        message = reasonPhrases["UNAUTHORIZED"],
        status = statusCode["UNAUTHORIZED"]
    ) {
        super(message, status);
    }
}

export {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
    Unauthorized,
};
