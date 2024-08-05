// Import necessary modules and packages
const mysql = require('mysql2/promise'); // MySQL module for connecting and executing queries
require('dotenv').config(); // dotenv module for loading environment variables

// Database configuration object, values are fetched from environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a connection pool to manage multiple connections
const pool = mysql.createPool(dbConfig);

// Export the connection pool for use in other modules
module.exports = pool;
