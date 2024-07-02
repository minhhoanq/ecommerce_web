import { PutObjectCommandOutput } from "@aws-sdk/client-s3";

export interface IImageService {
    upLoadImageS3({
        file,
    }: {
        file: Express.Multer.File;
    }): Promise<{ url: string; result: PutObjectCommandOutput }>;
    upLoadImageMultipleS3({
        files,
    }: {
        files: Express.Multer.File[];
    }): Promise<{ url: string; result: PutObjectCommandOutput }[]>;
}
