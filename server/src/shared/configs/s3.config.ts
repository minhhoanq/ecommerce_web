import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Config = {
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY as string,
    },
};

const s3 = new S3Client(s3Config);

export { s3, PutObjectCommand };
