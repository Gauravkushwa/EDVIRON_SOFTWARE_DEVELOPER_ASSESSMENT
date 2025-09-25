const bcrypt = require('bcrypt');
const {
    signAccessToken,
    createRefreshToken,
    validateRefreshToken,
    revokeRefreshToken,
    rotateRefreshToken
} = require('../utils/token');
const { UserModel } = require('../models/User');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// REGISTER USER
const registerUser = async ({ username, email, password, role }) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new Error("Email Already Registered");

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
    });

    return { ...user.toObject(), password: undefined };
};

// AUTHENTICATE / LOGIN USER
const authenticateUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) throw new Error("Invalid Credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Wrong Password");

    const accessToken = signAccessToken({ sub: user._id, role: user.role, email: user.email });
    const refreshToken = await createRefreshToken(user._id);

    return {
        user: { ...user, password: undefined },
        accessToken,
        refreshToken
    };
};

// REFRESH TOKENS
const refreshToken = async (rawRefreshToken) => {
    const tokenDoc = await validateRefreshToken(rawRefreshToken);
    if (!tokenDoc) throw new Error("Invalid Refresh Token");

    const user = await UserModel.findById(tokenDoc.user).lean();
    if (!user) throw new Error("User not found");

    const newRefreshToken = await rotateRefreshToken(tokenDoc);
    const newAccessToken = signAccessToken({ sub: user._id, role: user.role, email: user.email });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: { ...user, password: undefined }
    };
};

// LOGOUT
const logout = async (rawRefreshToken) => {
    const success = await revokeRefreshToken(rawRefreshToken);
    if (!success) throw new Error("Failed to logout or token already invalid");
    return { message: "Logged out successfully" };
};

module.exports = {
    registerUser,
    authenticateUser,
    refreshToken,
    logout
};
