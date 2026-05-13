import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized!" });



    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            err && res.status(403).json({ message: "Token is not valid!" });
            req.userID = payload.id;
          next();
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error!" });
    }
}