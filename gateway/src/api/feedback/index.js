const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

router.get(
    "/",
    createProxyMiddleware({
        target: "http://localhost:7000/api/v1/feedback",
        changeOrigin: true,
        // pathRewrite: {
        //     "^/feedback": "", // Loại bỏ /product khỏi đường dẫn yêu cầu khi chuyển tiếp
        // },
    })
);

module.exports = router;
