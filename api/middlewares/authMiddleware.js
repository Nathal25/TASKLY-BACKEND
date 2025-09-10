const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    // Get token from cookies
    const token =  req.cookies.token;

    //Verify if token exists
    if (!token) return res.status(401).json({message: "No token provided"});

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decodedToken contains the payload (when the token was created)
        req.userId = decodedToken.userID; // Save userID in the request for further use (in other routes)
        next(); // Call the next middleware or route body
    }catch(error){
        return res.status(401).json({message: "Invalid or expired token"});
    }
}

module.exports = authenticateToken;