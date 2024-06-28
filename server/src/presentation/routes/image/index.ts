import express from "express";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import { ImageController } from "../../controllers/image.controller";
import { uploadMemory } from "../../../shared/configs/multer.config";

const router = express.Router();

router.post(
    "/upload/product",
    uploadMemory.single("file"),
    asyncHandler(ImageController.uploadImageFromLocalS3)
);

export default router;
