const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");
dotenv.config();
const port = process.env.PORT || 6000;
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         credentials: true,
//     })
// );

app.use(
    "/feedback",
    createProxyMiddleware({
        target: "http://localhost:7000/api/v1/feedback",
        changeOrigin: true,
        // pathRewrite: {
        //     "^/feedback": "", // Loại bỏ /product khỏi đường dẫn yêu cầu khi chuyển tiếp
        // },
    })
);

app.listen(port, () => {
    console.log(`Gateway runing on port: ${port}`);
});

module.exports = app;
