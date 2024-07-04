import express from "express";
import authRouter from "./auth/index";
import productRouter from "./product/index";
import imageRouter from "./image/index";
import categoryRouter from "./category/index";
import cartRouter from "./cart/index";
import checkoutRouter from "./checkout/index";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/image", imageRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);

export default router;
