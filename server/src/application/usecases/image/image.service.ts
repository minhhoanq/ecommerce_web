import {
    PutObjectCommand,
    s3,
    GetObjectCommand,
    DeleteObjectCommand,
} from "../../../shared/configs/s3.config";
import "reflect-metadata";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { injectable } from "inversify";
import { IImageService } from "./image.interface";
import { PutObjectCommandOutput } from "@aws-sdk/client-s3";
const randomImageName = (): string => crypto.randomBytes(16).toString("hex");
const urlImagePublic = "https://djusmsx094025.cloudfront.net";

@injectable()
export class ImageService implements IImageService {
    upLoadImageS3 = async ({
        file,
    }: {
        file: Express.Multer.File;
    }): Promise<{ url: string; result: PutObjectCommandOutput }> => {
        const imageName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: "image/jpeg",
        });

        const result: any = await s3.send(command);

        const singleUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });

        const url = await getSignedUrl(s3, singleUrl, { expiresIn: 604800 });

        return {
            url: `${urlImagePublic}/${imageName}`,
            result,
        };
    };

    upLoadImageMultipleS3 = async ({
        files,
    }: {
        files: Express.Multer.File[];
    }): Promise<{ url: string; result: PutObjectCommandOutput }[]> => {
        // files
        const urlArray: { url: string; result: PutObjectCommandOutput }[] = [];
        const fn: any = files.map(async (file) => {
            const imageName = randomImageName();
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: "image/jpeg",
            });

            const result: any = await s3.send(command);

            const singleUrl = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
            });

            await getSignedUrl(s3, singleUrl, {
                expiresIn: 604800,
            });
            urlArray.push({
                url: `${urlImagePublic}/${imageName}`,
                result,
            });
        });

        await Promise.all(fn);

        return urlArray;
    };
}
