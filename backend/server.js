require('dotenv').config();
const AccessDB = require('./AccessDB'); // Adjust the path as necessary

app.get('/api/column-names/:tableName', async (req, res) => {
    const db = new AccessDB('bryanl6779', 'CNeutral_{!>2023<!}', 'devdb');
    try {
      await db.connect();
      const columnNames = await db.getColumnNames(req.params.tableName);
      res.json(columnNames);
    } catch (error) {
      console.error('Failed to get column names:', error);
      res.status(500).send('Failed to get column names');
    } finally {
      await db.closeConnection();
    }
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});