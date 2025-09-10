const rateLimit = require('express-rate-limit')

// Define the login rate limiter middleware
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per windowMs (per 10 minutes) 
    message: {
        message: "Too many requests, please try again after 10 minutes"
    },

    /**
    Return rate limit info in the headers 
    - RateLimit-Limit: Maximum number of requests allowed
    - RateLimit-Remaining: How many requests are allowed before reaching the limit
    - RateLimit-Reset: Time in seconds until the window restarts
    */
    standardHeaders: true,
    legacyHeaders: false, // Disable the old headers
})

module.exports = loginLimiter;