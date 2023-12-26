const { Pool } = require('pg');

class AccessDB {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
  }

  async query(query, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createTable(tableName, columns) {
    const client = await this.pool.connect();
    try {
      const columnDefs = Object.entries(columns)
        .map(([name, type]) => `${name} ${type}`)
        .join(', ');
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs});`;
      await client.query(query);
      console.log(`Created table '${tableName}' successfully.`);
    } catch (err) {
      console.error('Error creating table:', err);
    } finally {
      client.release();
    }
  }

  async insert(tableName, data) {
    const client = await this.pool.connect();
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *;`;
      const res = await client.query(query, values);
      console.log(`Data inserted into '${tableName}' successfully:`, res.rows[0]);
    } catch (err) {
      console.error('Error inserting data:', err);
    } finally {
      client.release();
    }
  }

  async extract(tableName) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT * FROM ${tableName};`;
      const res = await client.query(query);
      console.log(`Data extracted from '${tableName}' successfully:`, res.rows);
      return res.rows;
    } catch (err) {
      console.error('Error extracting data:', err);
      return [];
    } finally {
      client.release();
    }
  }

  async getColumnNames(tableName) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1;`;
      const res = await client.query(query, [tableName]);
      console.log('Column names:', res.rows.map(row => row.column_name));
      return res.rows.map(row => row.column_name);
    } catch (err) {
      console.error('Error fetching column names:', err);
      return [];
    } finally {
      client.release();
    }
  }
}

module.exports = AccessDB;
