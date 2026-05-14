import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
    console.log("User ID from token:", req.userID);
    res.status(200).json({ message: "You are logged in!", userID: req.userID });


}
export const shouldBeAdmin = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized! No token provided." });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized! Invalid token." });
            }
            if (!decoded.isAdmin) {
                return res.status(403).json({ message: "Forbidden! You are not an admin." });
            }

        })
        res.status(200).json({ message: "You are an Authenticated Admin" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to verify token!" });
    }
}