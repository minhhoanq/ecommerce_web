import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../shared/core/error.response";
import { SuccessResponse } from "../../shared/core/success.response";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../shared/constants/types";
import { IImageService } from "../../application/usecases/image/image.interface";

@injectable()
export class ImageController {
    private _imageServive: IImageService;

    constructor(@inject(TYPES.ImageService) imageService: IImageService) {
        this._imageServive = imageService;
    }

    uploadImageFromLocalS3 = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log("check");
            const { file } = req;

            console.log(req.file);

            if (!file) throw new BadRequestError("File missing!!");
            new SuccessResponse({
                message: "Successful Upload",
                metadata: await this._imageServive.upLoadImageS3({ file }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    uploadImageMultipleFromLocalS3 = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { files } = req;

            if (!files) throw new BadRequestError("Files missing!!");
            new SuccessResponse({
                message: "Successful Upload",
                metadata: await this._imageServive.upLoadImageMultipleS3({
                    files: files as Express.Multer.File[],
                }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}
