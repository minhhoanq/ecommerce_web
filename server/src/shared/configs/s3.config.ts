import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Config = {
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY as any,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY as any,
    },
};

const s3 = new S3Client(s3Config);

export { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand };
