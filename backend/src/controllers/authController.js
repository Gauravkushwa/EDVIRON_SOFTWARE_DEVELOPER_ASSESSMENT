const authService = require("../services/authService");



const register = async (req, res, next) => {
    try {
        const { username, email, password, role, } = req.body;
        const user = await authService.registerUser({ username, email, password, role});
        return res.status(201).json({
            MSG: "User Registered", user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);

    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.authenticateUser({ email, password });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh",
            maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7", 10)),

        });
        return res.json({ accessToken, user: { id: user._id,schoolId: user.schoolId, email: user.email, role: user.role } });
    } catch (error) {
        next(error)
    }
};


const refresh = async (req, res, next) => {
    try {
        const rawRefresh = req.cookies?.refreshToken || req.body.refreshToken;
        if (!rawRefresh) return res.status(401).json({ message: "No refresh token provided" });

        const { accessToken, refreshToken, user } = await authService.refreshTokens(rawRefresh);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth", 
            maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7", 10)),
        });

        return res.json({
            accessToken,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};


const logout = async (req, res, next) => {
    try {
        const rawRefresh = req.cookies?.refreshToken || req.body.refreshToken;
        if (rawRefresh) await authService.logout(rawRefresh);

        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
        return res.json({ message: "Logged out" });
    } catch (err) {
        next(err);
    }
};


module.exports = {register, login, refresh, logout}

