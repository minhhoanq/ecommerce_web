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
const randomImageName = () => crypto.randomBytes(16).toString("hex");
const urlImagePublic = "https://djusmsx094025.cloudfront.net";

@injectable()
export class ImageService implements IImageService {
    upLoadImageS3 = async ({ file }: { file: any }) => {
        console.log(process.env.AWS_BUCKET_NAME);
        try {
            const imageName = randomImageName();
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: "image/jpeg",
            });

            const result: any = await s3.send(command);
            console.log(result);

            const singleUrl = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
            });

            const url = await getSignedUrl(s3, singleUrl, { expiresIn: 3600 });
            console.log(url);

            return {
                url: `${urlImagePublic}/${imageName}`,
                result,
            };
        } catch (error) {
            console.log(error);
        }
    };
}
