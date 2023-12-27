const express = require('express');
const bodyParser = require('body-parser');
const AccessDB = require('./AccessDB'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new AccessDB('bryanl6779'); 

// Connect to the database
db.connect().then(() => {
    console.log('Connected to the database');
}).catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});

// Get data from a table
app.get('/createTable', async (req, res) => {
  const columnsDict = {
      id: 'integer PRIMARY KEY',
      symbol: 'text',
      name: 'text',
      country: 'text',
      website: 'text',
      description: 'text'
  };
  try {
      await db.create('company_basic', columnsDict);
      res.send('Table created successfully.');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error creating table');
  }
});

app.delete('/dropTable/:tablename', async (req, res) => {
  const tableName = req.params.tablename;
  try {
      await db.drop(tableName);
      res.send(`Table '${tableName}' dropped successfully.`);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error dropping table');
  }
});


app.get('/data/:tablename', async (req, res) => {
  try {
      const data = await db.extract(req.params.tablename);
      res.json(data); // Sends the data as a JSON response
  } catch (err) {
      res.status(500).send('Error retrieving data');
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
