// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // To load environment variables from .env file

// Import the AccessDB class (adjust the path as necessary)
const AccessDB = require('./AccessDB');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Instantiate your AccessDB class
const db = new AccessDB(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

// Define your API endpoint
app.get('/api/data', async (req, res) => {
  try {
    db.connect();
    const data = await db.extract('your_table_name');
    db.close_connection();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
