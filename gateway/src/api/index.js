const express = require("express");
const router = express.Router();
const feedbackRouter = require("./feedback/index");
const productRouter = require("./product/index");
const authRouter = require("./auth/index");
const cartRouter = require("./cart/index");
const orderRouter = require("./order/index");
const imageRouter = require("./image/index");
const categoryRouter = require("./category/index");

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/cart", cartRouter);
router.use("/api/v1/order", orderRouter);
router.use("/api/v1/feedback", feedbackRouter);
router.use("/api/v1/image", imageRouter);
router.use("/api/v1/category", categoryRouter);

module.exports = router;
