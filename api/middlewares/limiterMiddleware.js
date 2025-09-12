const rateLimit = require('express-rate-limit')

/**
 * Login rate limiter middleware.
 *
 * This middleware restricts the number of login requests from the same IP
 * within a given time window to prevent brute-force attacks.
 *
 * - Allows a maximum of **5 requests per 10 minutes** per IP.
 * - If the limit is exceeded, it responds with a JSON message and HTTP 429 (Too Many Requests).
 * - Uses the newer **RateLimit headers** (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`)
 */
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