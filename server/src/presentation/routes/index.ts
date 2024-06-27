import express from "express";
import authRouter from "./auth/index";
import productRouter from "./product/index";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);

export default router;
