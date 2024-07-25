import express, { NextFunction, Request, Response } from "express";
import authRouter from "./auth/index";
import productRouter from "./product/index";
import imageRouter from "./image/index";
import categoryRouter from "./category/index";
import cartRouter from "./cart/index";
import orderRouter from "./order/index";
import { container } from "../../infrastructure/di/inversify.config";
import { Auth } from "../auth/auth.util";
import { TYPES } from "../../shared/constants/types";
import { Access } from "../auth/rbac";

const router = express.Router();
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);
router.use("/verify", auth.authentication);
router.use("/access", async (req, res) => {
    // console.log(req.body);
    const rs = await access.GrantAccess(
        req.body.action,
        req.body.resource,
        req.body.user
    );

    console.log(rs);

    return await res.status(200).json(rs);
});

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/image", imageRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);

export default router;
