const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

router.get(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/category",
        changeOrigin: true,
    })
);

router.post(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/category",
        changeOrigin: true,
    })
);

router.patch(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/category",
        changeOrigin: true,
    })
);

module.exports = router;
