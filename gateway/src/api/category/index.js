const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authentication, grantAccess } = require("../../middleware/auth");
const router = express.Router();

router.get(
    "/",
    authentication,
    grantAccess("readOwn", "category"),
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
