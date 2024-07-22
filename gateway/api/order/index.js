const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

//create product + item
router.post(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/order",
        changeOrigin: true,
    })
);

router.post(
    "/checkout",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/order",
        changeOrigin: true,
    })
);

router.get(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/order",
        changeOrigin: true,
    })
);

//me
router.get(
    "/:orderId",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/order",
        changeOrigin: true,
    })
);

module.exports = router;
