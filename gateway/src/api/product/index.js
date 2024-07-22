const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

//create product + item
router.post(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

//create productItem
router.post(
    "/item",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

//update product
router.patch(
    "/:productItemId",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

//publish product
router.patch(
    "/publish/:productId",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

//unpublish product
router.patch(
    "/unpublish/:productId",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/publishs",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/drafts",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

//PUBLIC
router.get(
    "/search/:keySearch",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/search",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/:slug/variations",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

router.get(
    "/:slug",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/product",
        changeOrigin: true,
    })
);

module.exports = router;
