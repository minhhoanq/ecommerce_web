const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authentication } = require("../../middleware/auth");
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
    authentication,

    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/order",
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            // Convert the req.body to JSON and write it to the proxy request
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader(
                    "Content-Length",
                    Buffer.byteLength(bodyData)
                );
                proxyReq.write(bodyData);
            }
        },
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
