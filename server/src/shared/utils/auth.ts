import JWT from "jsonwebtoken";
import crypto from "crypto";

export const createTokensPair = async (
    payload: any,
    publicKey: string,
    privateKey: string
) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        // JWT.verify(accessToken, publicKey, (err, decode) => {
        //     if (err) {
        //         console.error(`error verify::`, err);
        //     } else {
        //         console.log(`decode verify::`, { accessToken, publicKey });

        //         console.log(`decode verify::`, decode);
        //     }
        // });

        return { accessToken, refreshToken };
    } catch (error) {}
};

export const createPasswordChangedToken = () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const passwordResetExpires = String(Date.now() + 10 * 60 * 1000);
    return {
        resetToken,
        passwordResetToken,
        passwordResetExpires,
    };
};
