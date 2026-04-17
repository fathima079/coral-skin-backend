const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");
const { randomBytes, createHash } = require("crypto");
const { default: sendEmail } = require("../utils/sendMail");
require("dotenv").config();

const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create({
            name,
            email,
            password,
            role: req.body.role || "user"
        });

        const accessToken = generateToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save();

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken, 
          refreshToken
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken, 
          refreshToken
    });
    } else {
      res.status(401).json({message: "Invalid credentials"})
    }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user){
    return res.json({
      message: "If the email exists, a reset link has been sent"
    });
  }

  const resetToken = randomBytes(32).toString("hex");

  const hashedToken = createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `https://coral-skin.vercel.app/reset-password/${resetToken}`

  await sendEmail ({
    to: user.email,
    subject: "Password reset request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  res.json({
    message: "If the email exists, a reset link as been sent"
  });
};

const resetPassword = async (req, res) => {
  try {

    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired link",
      });
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshTokenController = async ( req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({message: "Refresh token missing"});

  try{
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return res.status(403).json({message: "Invalid refresh token"});
  }

  const newAccessToken = generateToken(user._id);

  user.accessToken = newAccessToken;
  await user.save();

    res.json({
      accessToken: newAccessToken,
    });

} catch (error) {
  return res.status(403).json({message: "Token invalid or expired"});
}

}

const logout = async (req, res) => {
  try {
    const { token } = req.body;

    if(!token){
      return res.status(400).json({message: "Refresh token required"});
    }

    const user = await User.findOne({ refreshToken: token });

    if(!user){
      return res.json({message: "User logged out successfully"})
    }

    if (user) {
      user.accessToken = null;
      user.refreshToken = null;
      await user.save();
    }

    res.json({message: "Logged out successfully"})

  } catch (err) {
    res.status(500).json({message: err.message})
  };
};

module.exports = { register, login, getProfile, forgotPassword, resetPassword, refreshTokenController, logout };