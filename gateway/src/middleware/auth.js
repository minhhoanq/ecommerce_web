const { asyncHandler } = require("../helpers/asyncHandler");
const axios = require("axios");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rtoken-id",
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];

    console.log("userId: ", userId);
    console.log(accessToken + " | " + refreshToken);

    const rs = await axios.post("http://localhost:8002/verify", {
        userId,
        accessToken,
        refreshToken,
    });

    console.log(rs.data);
    next();
});

module.exports = authentication;
