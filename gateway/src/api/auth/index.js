const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

//me
router.get(
    "/me",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

//create product + item
router.post(
    "/signup",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

//create productItem
router.post(
    "/signin",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

//update product
router.put(
    "/final-signup/:token",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

//publish product
router.post(
    "/forgot-password",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

//unpublish product
router.put(
    "/reset-password",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
        changeOrigin: true,
    })
);

module.exports = router;
