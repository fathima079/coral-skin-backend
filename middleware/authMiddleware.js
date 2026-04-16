const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = ( req, res, next ) => {
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "Not authorized"});
    }
    if (token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
};

module.exports = protect;