import {
    DomainError,
    DomainErrorCode,
    DomainErrorDetailCode,
} from "../exception";
import { ValueObject } from "./base";
import { z } from "zod";

const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mailSchema = z.string().regex(emailRegex);

type MailType = z.infer<typeof mailSchema>;

export class EmailVO extends ValueObject {
    value: string;
    constructor(input: MailType) {
        super();

        try {
            mailSchema.parse(input);
            this.value = input;
        } catch (error) {
            throw new DomainError({
                code: DomainErrorCode.BAD_REQUEST,
                message: "Invalid Email",
                info: {
                    detailCode: DomainErrorDetailCode.INVALID_EMAIL_FORMAT,
                },
            });
        }
    }

    toString() {
        return this.value;
    }
}
