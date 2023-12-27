const { Client } = require('pg');

class AccessDB {
    constructor(name, password = "CNeutral_{!>2023<!}", databaseName = "devdb") {
        this.name = name;
        this.password = password;
        this.host = "localhost";
        this.port = 5432;
        this.database = databaseName;
        this.client = null;
    }

    async connect() {
        this.client = new Client({
            user: this.name,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port,
        });

        try {
            await this.client.connect();
        } catch (err) {
            console.error("Error: Unable to connect to the database", err);
        }
    }

    async closeConnection() {
        await this.client.end();
    }

    async create(tablename, columnsDict) {
        try {
            const tableExists = await this.client.query("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = $1);", [tablename]);
            if (!tableExists.rows[0].exists) {
                let columns = Object.entries(columnsDict).map(([name, type]) => `${name} ${type}`).join(", ");
                const query = `CREATE TABLE ${tablename} (${columns});`;
                await this.client.query(query);
                console.log(`Created table '${tablename}' successfully.`);
            } else {
                console.log("NOT created: Table already exists");
            }
        } catch (err) {
            console.error("UNSUCCESSFUL: An error occurred in creating table", err);
        }
    }

    async extract(tablename) {
        try {
            const result = await this.client.query(`SELECT * FROM ${tablename};`);
            if (result.rows.length > 0) {
                console.log(`Data extracted from '${tablename}' successfully:`);
                return result.rows;
            } else {
                console.log(`No data found in '${tablename}'.`);
                return [];
            }
        } catch (err) {
            console.error("UNSUCCESSFUL: an error has occurred in extracting data", err);
        }
    }

    async insert(tablename, data) {
        try {
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
            const query = `INSERT INTO ${tablename} (${columns.join(", ")}) VALUES (${placeholders});`;
            await this.client.query(query, values);
            console.log(`Data inserted into '${tablename}' successfully.`);
        } catch (err) {
            console.error("UNSUCCESSFUL: An error has occurred in inserting data.", err);
        }
    }

    async drop(tablename) {
      try {
          const query = `DROP TABLE ${tablename};`;
          await this.client.query(query);
          console.log(`Table '${tablename}' dropped successfully.`);
      } catch (err) {
          console.error("UNSUCCESSFUL: An error has occurred in dropping the table.", err);
      }
  }

  async update(tablename, dataOld, dataNew) {
      try {
          const setParts = Object.keys(dataNew).map((key, index) => `${key} = $${index + 1}`);
          const whereParts = Object.keys(dataOld).map((key, index) => `${key} = $${index + 1 + setParts.length}`);
          const query = `UPDATE ${tablename} SET ${setParts.join(", ")} WHERE ${whereParts.join(" AND ")};`;
          const values = [...Object.values(dataNew), ...Object.values(dataOld)];
          await this.client.query(query, values);
          console.log(`Data updated in '${tablename}' successfully.`);
      } catch (err) {
          console.error("UNSUCCESSFUL: An error has occurred in updating data.", err);
      }
  }

  async dataNames(table_name) {
      try {
          const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1`;
          const result = await this.client.query(query, [table_name]);
          return result.rows.map(row => row.column_name);
      } catch (err) {
          console.error("Error in retrieving column names", err);
      }
  }
}

module.exports = AccessDB;
