import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { CategoryController } from "../../controllers/category.controller";
import { TYPES } from "../../../shared/constants/types";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
const router = express.Router();

const controller = container.get<CategoryController>(TYPES.CategoryController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.get("", controller.getCategories.bind(controller));
router.post("", controller.createCategory.bind(controller));
router.patch("", controller.updateCategory.bind(controller));

export default router;
