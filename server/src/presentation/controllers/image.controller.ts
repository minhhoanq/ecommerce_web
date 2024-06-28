import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../shared/core/error.response";
import { SuccessResponse } from "../../shared/core/success.response";
import { upLoadImageS3 } from "../../application/usecases/image/image.service";

export class ImageController {
    static uploadImageFromLocalS3 = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { file } = req.body;

        if (!file) throw new BadRequestError("File missing!!");
        new SuccessResponse({
            message: "Successful Upload",
            metadata: await upLoadImageS3({
                file,
                // ...req.body
            }),
        }).send(res);
    };
}
