import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import ProductController from "../../controllers/product.controller";
import { TYPES } from "../../../shared/constants/types";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
const router = express.Router();

const controller = container.get<ProductController>(TYPES.ProductController);

//PUBLIC
router.get(
    "/search/:keySearch",
    asyncHandler(controller.searchs.bind(controller))
);
router.get("/", asyncHandler(controller.getProducts.bind(controller)));
router.get("/:productId", asyncHandler(controller.getProduct.bind(controller)));

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
router.get("/drafts", asyncHandler(controller.getDrafts.bind(controller)));

export default router;
