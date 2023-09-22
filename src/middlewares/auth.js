import jwt from "jsonwebtoken";
const config = process.env;
import express from "express";

const app = express();
app.use(express.json());

const { TokenExpiredError } = jwt

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ message: "Unauthorized! Access Token was expired!" });
  }
    return res.status(401).json({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"]
    ? req.headers["authorization"].replace("Bearer", "").trim()
    : null;
  const token = req.body.token || req.query.token || bearer;
  if (!token) {
    return res
      .status(401)
      .json({ message: "A token is required for authentication" });
  }
  jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user = decoded;
    return next();
  });
}
    
export default verifyToken;