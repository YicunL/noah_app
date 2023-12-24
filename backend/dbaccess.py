#python module for upload, extract, delete and update remote database in postgres
#%pip install psycopg2-binary
import psycopg2
from psycopg2 import sql

#defining class
class AccessDB:
    def __init__(self, name, password = "CNeutral_{!>2023<!}", databaseName = "devdb") -> None:
        #assign values
        self.name = name
        self.password = password
        self.host = "localhost" #"compute.cneutral.io" #"localhost"
        self.port = 5432
        self.database = databaseName
        self.conn = None
        self.cur = None
    
    def connect(self):
        #This method tries to connect to the database and create a cursor to perform actions on database.
        #This method should be used everytime after defining the class or when reconnecting to the db.
        try:
            self.conn = psycopg2.connect(database = self.database, 
                            user = self.name, 
                            host= self.host,
                            password = self.password,
                            port = self.port)
            self.cur = self.conn.cursor()
        except psycopg2.Error as e:
            print("Error: Unable to connect to the database")
            print(e)

    def close_connection(self):
        #This method closes connection to the database
        #This method should be used when you are done using the database.
        self.conn.commit()
        self.cur.close()
        self.conn.close()

    def create(self, tablename, columns_dict:dict):
        #This method is used for creating new table to the db.
        # Check if the table already exists
        table_exists_query = sql.SQL("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = %s);")
        self.cur.execute(table_exists_query, [tablename])
        table_exists = self.cur.fetchone()[0]

        if not table_exists:
            #Generate SQL query for inserting data into the specified table
            column_query = sql.SQL(", ").join(
                [sql.SQL("{} {}").format(sql.Identifier(column_name), sql.SQL(column_type)) for column_name, column_type in columns_dict.items()]
            )
            query = sql.SQL("CREATE TABLE {} ({})").format(
                sql.Identifier(tablename),
                column_query
            )
            #Send the query
            try:
                self.cur.execute(query)
                print(f"Created table '{tablename}' successfully.")
            except psycopg2.Error as e:
                print("UNSUCCESSFUL: An error occured in creating table")
                print(e)
        else:
            print("NOT created: Table already exist")

    def extract(self, tablename):
        #This method extract data from a table and return as a list of tuples.
        query = sql.SQL("SELECT * FROM {};").format(sql.Identifier(tablename))
        try:
            self.cur.execute(query)
            rows = self.cur.fetchall()
        except psycopg2.Error as e:
            print("UNSUCCESSFUL: an error has occured in extracting data")
            print(e)
        if rows:
            print(f"Data extracted from '{tablename}' successfully:")
            # for row in rows:
            #     print(row)
            return rows
        else:
            print(f"No data found in '{tablename}'.")
            return [0]

    def insert(self, tablename, data:dict):
        #this method insert new data to a table 
        # Generate SQL query for inserting data into the specified table
        columns = data.keys()
        query = sql.SQL("INSERT INTO {} ({}) VALUES ({});").format(
            sql.Identifier(tablename),
            sql.SQL(', ').join(map(sql.Identifier, columns)),
            sql.SQL(', ').join(map(sql.Placeholder, columns))
        )
        try:
            # Execute the query
            self.cur.execute(query,data)
            print(f"Data inserted into '{tablename}' successfully.")
        except psycopg2.Error as e:
            print("UNSUCCESSFUL: An error has occurred in inserting data.")
            print(e)

    def drop(self, tablename):
        #this method delete a whole table
        try:
            # Generate SQL query for dropping the specified table
            query = f"DROP TABLE {tablename};"
            
            # Execute the query to drop the table
            self.cur.execute(query)

            print(f"Table '{tablename}' dropped successfully.")
        except psycopg2.Error as e:
            print("UNSUCCESSFUL: An error has occurred in dropping the table.")
            print(e)        

    def update(self, tablename, data_old:dict, data_new:dict):
        #this method updates data by replacing old data with new data
        # Generate SQL query for updating data in the specified table
        set_query = sql.SQL(', ').join(
            [sql.SQL("{} = {}").format(sql.Identifier(column), sql.Placeholder()) for column in data_new.keys()]
        )
        where_query = sql.SQL(' AND ').join(
            [sql.SQL("{} = {}").format(sql.Identifier(column), sql.Placeholder()) for column in data_old.keys()]
        )
        query = sql.SQL("UPDATE {} SET {} WHERE {};").format(
            sql.Identifier(tablename),
            set_query,
            where_query
        )
        try:
            # Execute the query with the provided data
            self.cur.execute(query, {**data_new, **data_old})
            print(f"Data updated in '{tablename}' successfully.")
        except psycopg2.Error as e:
            print("UNSUCCESSFUL: An error has occurred in updating data.")
            print(e)

    def dataNames(self, table_name):
        # query = sql.SQL("SELECT column_name FROM information_schema.columns WHERE table_name = '{}'").format(sql.Identifier(table_name))
        query = "SELECT column_name FROM information_schema.columns WHERE table_name = '{}'".format(table_name)
        self.cur.execute(query)
        column_names = [row[0] for row in self.cur.fetchall()]
        return column_names