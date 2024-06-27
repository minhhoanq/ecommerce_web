import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import ProductController from "../../controllers/product.controller";
import { TYPES } from "../../../shared/constants/types";
const router = express.Router();

const controller = container.get<ProductController>(TYPES.ProductController);

router.get("/", controller.getProducts.bind(controller));

export default router;
