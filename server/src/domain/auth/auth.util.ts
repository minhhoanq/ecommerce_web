import JWT from "jsonwebtoken";

export const createTokensPair = async (
    payload: any,
    privateKey: string,
    publicKey: string
) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};
