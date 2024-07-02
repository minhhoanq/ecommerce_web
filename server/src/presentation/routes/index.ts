import express from "express";
import authRouter from "./auth/index";
import productRouter from "./product/index";
import imageRouter from "./image/index";
import categoryRouter from "./category/index";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/image", imageRouter);
router.use("/category", categoryRouter);

export default router;
