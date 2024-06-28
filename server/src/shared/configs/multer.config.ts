import { Request } from "express";
import multer from "multer";

const uploadMemory = multer({
    storage: multer.memoryStorage(),
});

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req: Request, file: any, cb: any) {
            cb(null, "./src/shared/uploads/");
        },
        filename: function (req: Request, file: any, cb: any) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

export { uploadMemory, uploadDisk };
