import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { CartController } from "../../controllers/cart.controller";
import { TYPES } from "../../../shared/constants/types";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
const router = express.Router();

const controller = container.get<CartController>(TYPES.CartController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.post(
    "",
    auth.authentication,
    access.GrantAccess("createOwn", "cart"),
    asyncHandler(controller.addToCart.bind(controller))
);

router.patch(
    "/update",
    auth.authentication,
    access.GrantAccess("updateOwn", "cart"),
    asyncHandler(controller.updateToCart.bind(controller))
);

router.delete(
    "",
    auth.authentication,
    access.GrantAccess("deleteOwn", "cart"),
    asyncHandler(controller.deleteToCartItem.bind(controller))
);

router.get(
    "",
    auth.authentication,
    access.GrantAccess("readOwn", "cart"),
    asyncHandler(controller.getCartItems.bind(controller))
);

export default router;
