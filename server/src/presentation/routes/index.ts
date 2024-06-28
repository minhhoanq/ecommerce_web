import express from "express";
import authRouter from "./auth/index";
import productRouter from "./product/index";
import imageRouter from "./image/index";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/image", imageRouter);

export default router;
