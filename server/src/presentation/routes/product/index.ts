import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import ProductController from "../../controllers/product.controller";
import { TYPES } from "../../../shared/constants/types";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
const router = express.Router();

const controller = container.get<ProductController>(TYPES.ProductController);

//AUTHENTICATION
router.post("/", controller.createProduct.bind(controller));
router.patch("/:productItemId", controller.updateProduct.bind(controller));
router.patch("/publish/:productId", controller.publishProduct.bind(controller));
router.patch(
    "/unpublish/:productId",
    controller.unPublishProduct.bind(controller)
);
//QUERY
router.get("/publishs", asyncHandler(controller.getPublishs.bind(controller)));

export default router;
