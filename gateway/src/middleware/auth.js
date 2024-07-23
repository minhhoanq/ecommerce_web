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

    const rs = await axios.post("http://localhost:8002/verify", {
        userId,
        accessToken,
        refreshToken,
    });

    if (rs.data?.authen) {
        (req.user = rs.data?.authen.decodeUser),
            (req.keyStore = rs.data?.authen.keyStore),
            (req.refreshToken = rs.data?.authen?.refreshToken);
        return next();
    }
    return res.status(403).json(rs.data);
});

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        const rs = await axios.post("http://localhost:8002/access", {
            action,
            resource,
            user: req.user,
        });

        console.log(rs.data);
        if (rs.data) return next();
        return res
            .status(403)
            .json(rs.data === false && "You don't have enough permissions");
    };
};

module.exports = { authentication, grantAccess };
