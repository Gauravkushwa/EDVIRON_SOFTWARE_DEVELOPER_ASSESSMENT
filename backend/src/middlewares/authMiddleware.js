const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Extract token
    const token = header.split(" ")[1];

    // ✅ Correct way: verify the token string
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRETE);
    console.log("Decoded payload:", payload);

    const userId = payload.sub || payload.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    const user = await UserModel.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("JWT Verify failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
};


const authorizedRole =  (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};

module.exports = {authMiddleware, authorizedRole}