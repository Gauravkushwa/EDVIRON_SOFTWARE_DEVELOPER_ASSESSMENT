
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true }, 
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    replacedByTokenHash: { type: String, default: null } 
  },
  { timestamps: true, versionKey: false }
);

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = { RefreshTokenModel };
