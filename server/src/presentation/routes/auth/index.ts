import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { AuthController } from "../../controllers/auth.controller";
import { TYPES } from "../../../shared/constants/types";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";

const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.get("/me", auth.authentication, controller.me.bind(controller));
router.post("/signup", controller.signup.bind(controller));
router.post("/signin", controller.signin.bind(controller));
router.put("/final-signup/:token", controller.finalSignup.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.put("/reset-password", controller.resetPassword.bind(controller));
router.get(
    "/product",
    auth.authentication,
    // access.GrantAccess("readAny", "product"),
    controller.test.bind(controller)
);

export default router;
