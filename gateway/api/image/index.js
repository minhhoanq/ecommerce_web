const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

//create product + item
router.post(
    "/thumbnail",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/image",
        changeOrigin: true,
    })
);

router.post(
    "/thumbnail/multiple",
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/image",
        changeOrigin: true,
    })
);

module.exports = router;
