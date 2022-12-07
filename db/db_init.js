// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

const fs = require("fs");

/**** Delete existing table, if any ****/

const drop_event_table_sql = "DROP TABLE IF EXISTS `event`;"

db.execute(drop_event_table_sql);

/**** Create "event" table (again)  ****/

const create_event_table_sql = `
    CREATE TABLE event (
        event_id int NOT NULL AUTO_INCREMENT,
        event varchar(150) NOT NULL,
        date date NOT NULL,
        time time NOT NULL,
        location varchar(45) NOT NULL,
        avail_slots varchar(150) NOT NULL,
        description varchar(150) DEFAULT NULL,
        PRIMARY KEY (event_id)
  );
`
db.execute(create_event_table_sql);

/**** Create some sample events ****/

const insert_event_table_sql = `
    INSERT INTO event 
        (event, date, time, location, avail_slots, description) 
    VALUES 
        (?, ?, ?, ?, ?, ?);
`
db.execute(insert_event_table_sql, ['Cooking and Packaging', '2022-05-24', '02:22', 'Ridgewood Church', '20', null]);

db.execute(insert_event_table_sql, ['Cooking only', '2022-06-03', '02:22', 'No Fuss Lunch Kitchen', '20', null]);

db.execute(insert_event_table_sql, ['Clean-up', '10/2', '02:22', 'No Fuss Lunch Kitchen', '20', null]);

db.execute(insert_event_table_sql, ['Delivery', '11/20', '02:22', 'No Fuss Lunch Kitchen', '20', null]);

/**** Read the sample items inserted ****/

const read_event_table_sql = "SELECT * FROM event";

db.execute(read_event_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'event' initialized with:")
        console.log(results);
    }
);

db.end();