const express = require("express");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
const { asyncHandler } = require("../gateway/src/helpers/asyncHandler");
dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    "/verify",
    asyncHandler(async (req, res) => {
        const rs = await axios.post(
            "http://localhost:8000/api/v1/verify",
            {},
            {
                headers: {
                    "x-client-id": +req.body.userId,
                    authorization: req.body.accessToken,
                },
            }
        );
        return res.json(rs.data);
    })
);

app.use(
    "/access",
    asyncHandler(async (req, res) => {
        const rs = await axios.post("http://localhost:8000/api/v1/access", {
            action: req.body.action,
            resource: req.body.resource,
            user: req.body.user,
        });
        return res.json(rs.data);
    })
);

app.listen(port, () => {
    console.log(`Gateway runing on port: ${port}`);
});

module.exports = app;
