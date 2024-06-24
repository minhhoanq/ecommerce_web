import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import AuthController from "../../controllers/auth.controller";
import { TYPES } from "../../../shared/constants/types";

const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

router.post("/signup", controller.signup.bind(controller));

export default router;
