import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in enviroment variables");
    }

    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};