import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import ProductController from "../../controllers/product.controller";
import { TYPES } from "../../../shared/constants/types";
const router = express.Router();

const controller = container.get<ProductController>(TYPES.ProductController);

router.post("/create", controller.createProduct.bind(controller));
router.patch(
    "/update/:productItemId",
    controller.updateProduct.bind(controller)
);

export default router;
