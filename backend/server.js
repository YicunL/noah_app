const express = require('express');
const AccessDB = require('./dbAccess');

require('dotenv').config();

const app = express();
const db = new AccessDB();

app.use(express.json());

// Example route to fetch data
app.get('/api/data/comp_basic', async (req, res) => {
    try {
      const data = await dbAccess.query('comp_basic');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

// More routes here...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
