const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { RefreshTokenModel } = require("../models/refreshToken");

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7", 10);

const signAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRETE, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
}

const verifyAccessToken = (token) =>{
    return jwt.verify(token, process.env.JWT_ACCESS_SECRETE);
}

const generateRefereshToken = () =>{
    return crypto.randomBytes(64).toString('hex')
};

const hashToken = (token) =>{
    return crypto.createHash('sha256').update(token).digest('hex')
};

const createRefreshToken = async(userId) =>{
    const token = generateRefereshToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.create({
        user: userId,
        tokenHash,
        expiresAt
    });

    return token
};


const rotateRefreshToken = async(currentTokenHash, userId) =>{
    const newToken = generateRefereshToken();
    const newHash = hashToken(newToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.findOneAndUpdate(
        {tokenHash: currentTokenHash, user: userId, revoked: false},
        {revoked: true, replacedByTokenHash: newHash}, 
        {new: true}
    );
    await RefreshTokenModel.create({
        user: userId,
        tokenHash : newHash,
        expiresAt,
    });

    return newToken
};

const validateRefreshToken = async(rawToken) =>{
    if(!rawToken) return null;

    const tokenHash = hashToken(rawToken);
    const doc = await RefreshTokenModel.findOne({tokenHash}).populate("User");

    if(!doc) return null;
    if(new Date() > doc.expiresAt) return null;

    return doc;
};

const revokeRefreshToken = async(rawToken) =>{
    await RefreshTokenModel.findOneAndUpdate({tokenHash}, {revoked: true});
};



module.exports = {
    signAccessToken,
    verifyAccessToken,
    createRefreshToken,
    validateRefreshToken,
    revokeRefreshToken,
    rotateRefreshToken,
    hashToken,
}

