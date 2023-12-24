const { Pool } = require('pg');

class AccessDB {
  constructor(user, password, databaseName, host = 'localhost', port = 5432) {
    this.pool = new Pool({
      user: user,
      password: password,
      host: host,
      port: port,
      database: databaseName
    });
  }

  async connect() {
    this.client = await this.pool.connect();
  }

  async closeConnection() {
    this.client.release();
  }

  async createTable(tableName, columns) {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${Object.entries(columns)
          .map(([name, type]) => `${name} ${type}`)
          .join(', ')}
      );
    `;
    await this.client.query(query);
  }

  async extract(tableName) {
    const query = `SELECT * FROM ${tableName};`;
    const res = await this.client.query(query);
    return res.rows;
  }

  async insert(tableName, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const query = `
      INSERT INTO ${tableName} (${keys.join(', ')})
      VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})
      RETURNING *;
    `;

    const res = await this.client.query(query, values);
    return res.rows[0];
  }

  async dropTable(tableName) {
    const query = `DROP TABLE IF EXISTS ${tableName};`;
    await this.client.query(query);
  }

  async update(tableName, dataToUpdate) {
    const keys = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}; // Assuming you're updating based on the 'id' column
    `;

    await this.client.query(query, [...values, id]); // 'id' should be the identifier of the row to update
  }

  async getColumnNames(tableName) {
    const query = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '${tableName}';
    `;

    const res = await this.client.query(query);
    return res.rows.map(row => row.column_name);
  }
}

module.exports = AccessDB;
