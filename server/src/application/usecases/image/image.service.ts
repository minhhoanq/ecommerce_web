import { PutObjectCommand, s3 } from "../../../shared/configs/s3.config";
import crypto from "crypto";

const upLoadImageS3 = async (file: any) => {
    try {
        const randomImageName = () => crypto.randomBytes(16).toString("hex");
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: randomImageName(),
            Body: file.buffer,
            ContentType: "image/jpeg",
        });

        const result: any = await s3.send(command);
        console.log(result);
        return result;
    } catch (error) {}
};

export { upLoadImageS3 };
