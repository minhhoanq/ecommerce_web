import express from "express";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import { ImageController } from "../../controllers/image.controller";
import { uploadMemory } from "../../../shared/configs/multer.config";
import { container } from "../../../infrastructure/di/inversify.config";
import { TYPES } from "../../../shared/constants/types";

const router = express.Router();
const controller = container.get<ImageController>(TYPES.ImageController);
router.use(express.json());

router.post(
    "/thumbnail",
    uploadMemory.single("file"),
    asyncHandler(controller.uploadImageFromLocalS3.bind(controller))
);

router.post(
    "/thumbnail/multiple",
    uploadMemory.array("files", 3),
    asyncHandler(controller.uploadImageMultipleFromLocalS3.bind(controller))
);

export default router;
