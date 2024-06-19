const refreshTokenModel = require("../models/refreshToken.model");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createToken = async (user) => {
    const randomToken = uuidv4();

    const salt = crypto.randomBytes(16).toString("hex");

    const refreshToken = crypto.pbkdf2Sync(
        randomToken, 
        salt, 
        100000, 
        64, 
        "sha512"
    ).toString("hex");

    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + 86400);

    let refreshTokenObject = new refreshTokenModel({
        token: refreshToken,
        user: user._id,
        expiredDate: expiredAt.getTime(),
    });

    const savedRefreshToken = await refreshTokenObject.save();
    return savedRefreshToken.token;
};

const refreshAccessToken = async (refreshToken) => {
    const refreshTokenObject = await refreshTokenModel.findOne({ token: refreshToken });

    if (!refreshTokenObject || refreshTokenObject.expiredDate < new Date()) {
        throw new Error("Invalid or expired refresh token");
    }

    const newAccessToken = jwt.sign(
        { id: refreshTokenObject.user },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: 86400 }
    );

    return newAccessToken;
};
module.exports = {
    createToken,
    refreshAccessToken
};