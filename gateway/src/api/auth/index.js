const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authentication } = require("../../middleware/auth");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//me
router.get(
    "/me",
    authentication,
    createProxyMiddleware({
        target: "http://localhost:8000/api/v1/auth",
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
        // onProxyReq: (proxyReq, req, res) => {
        //     console.log("req.body");

        //     // Convert the req.body to JSON and write it to the proxy request
        //     if (req.body) {
        //         const bodyData = JSON.stringify(req.body);
        //         proxyReq.setHeader("Content-Type", "application/json");
        //         proxyReq.setHeader(
        //             "Content-Length",
        //             Buffer.byteLength(bodyData)
        //         );
        //         proxyReq.write(bodyData);
        //     }
        // },
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
