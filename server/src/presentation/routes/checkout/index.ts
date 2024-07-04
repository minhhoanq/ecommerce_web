import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { CheckoutController } from "../../controllers/checkout.controller";
import { TYPES } from "../../../shared/constants/types";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
const router = express.Router();

const controller = container.get<CheckoutController>(TYPES.CheckoutController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.post(
    "",
    auth.authentication,
    access.GrantAccess("createOwn", "checkout"),
    asyncHandler(controller.checkout.bind(controller))
);

export default router;
