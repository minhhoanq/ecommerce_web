const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

//create product + item
router.post(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/cart",
        changeOrigin: true,
    })
);

//create productItem
router.patch(
    "/update",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/cart",
        changeOrigin: true,
    })
);

//update product
router.delete(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/cart",
        changeOrigin: true,
    })
);

//me
router.get(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/cart",
        changeOrigin: true,
    })
);

module.exports = router;
