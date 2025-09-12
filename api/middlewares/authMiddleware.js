const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT tokens.
 * 
 * This middleware checks for the existence of a JWT token in cookies,
 * verifies it using the jwt_secret, and attaches the decoded
 * user ID to the request object for further usage in subsequent routes.
 * 
 * If the token is missing, invalid, or expired, it returns a 401 response.
 * 
 * @function authenticateToken
 * @param {import("express").Request} req - Express request object. Expects `req.cookies.token` to contain the JWT.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 * @returns {void} - Sends a 401 response if authentication fails, otherwise calls `next()`.
 */
function authenticateToken(req, res, next) {
    // Get token from cookies
    const token =  req.cookies.token;

    //Verify if token exists
    if (!token) return res.status(401).json({message: "No token provided"});

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decodedToken contains the payload (when the token was created)
        req.userId = decodedToken.userId; // Save userID in the request for further use (in other routes)
        next(); // Call the next middleware or route body
    }catch(error){
        return res.status(401).json({message: "Invalid or expired token"});
    }
}

module.exports = authenticateToken;