const express = require("express");
require("dotenv").config();

const cors = require("cors");
const routes = require("./routes/routes.js");
const { connectDB } = require("./config/database");
const cookieParser = require('cookie-parser'); // Import cookie-parser for parsing cookies

const app = express();
const baseUrl = process.env.BASE_URL;
/**
 * Middleware configuration
 * - Parse JSON request bodies
 * - Parse URL-encoded request bodies
 * - Enable Cross-Origin Resource Sharing (CORS)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors())
app.use(cors({
  origin: baseUrl,  // el dominio de tu frontend
  credentials: true   // permite enviar cookies/headers auth
}));

//Enable cookie parsing for all requests to read cookies (like the JWT token cookie)
app.use(cookieParser());

/**
 * Initialize database connection.
 * Exits the process if the connection fails.
 */
connectDB();

/**
 * Mount the API routes.
 * All feature routes are grouped under `/api/v1`.
 */
app.use("/api/v1", routes);

/**
 * Health check endpoint.
 * Useful to verify that the server is up and running.
 */
app.get("/", (req, res) => res.send("Server is running"));

/**
 * Start the server only if this file is run directly
 * (prevents multiple servers when testing with imports).
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

