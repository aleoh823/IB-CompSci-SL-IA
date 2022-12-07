//set up the server
const express = require( "express" );
const app = express();
const logger = require("morgan");
const db = require('./db/db_connection');
const port = 8080;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

// define middleware that logs all incoming requests
app.use(logger("dev"));
// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));
// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
});

// define a route for the stuff inventory page
const read_event_all_sql = `
    SELECT 
        event_id, event, date, time, location, avail_slots, description
    FROM
        event
`
app.get( "/main", ( req, res ) => {
    db.execute(read_event_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.render('main', { inventory : results });
        }
    });
} );

// define a route for the item detail page
const read_event_sql = `
    SELECT 
        event, date, time, location, avail_slots, description
    FROM
        event
    WHERE
        event_id = ?
`
app.get( "/main/signup/:id", ( req, res ) => {
    db.execute(read_event_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            data["id"] = req.params.id;
            // data's object structure: 
            //  { item: ___ , quantity:___ , description: ____ }
            res.render('signup', data);
        }
    });
});

// define a route for item DELETE
const delete_event_sql = `
    DELETE 
    FROM
        event
    WHERE
        event_id = ?
`
app.get("/main/signup/:id/delete", ( req, res ) => {
    db.execute(delete_event_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/main");
        }
    });
})

// define a route for item Create
const insert_event_sql = `
    INSERT INTO event
        (event, date, time, location, avail_slots)
    VALUES
        (?, ?, ?, ?, ?)
`
app.post("/main", ( req, res ) => {
    console.log(req.body);
    db.execute(insert_event_sql, [req.body.name, req.body.date, req.body.time, req.body.location, req.body.avail_slots], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/main/signup/${results.insertId}`);
        }
    });
})

// define a route for item UPDATE
const update_event_sql = `
    UPDATE
        event
    SET
        event = ?,
        date = ?,
        time = ?,
        location = ?,
        avail_slots = ?,
        description = ?
    WHERE
        event_id = ?
`
app.post("/main/signup/:id", ( req, res ) => {
    db.execute(update_event_sql, [req.body.name, req.body.date, req.body.time, req.body.location, req.body.vol_slots, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/main/signup/${req.params.id}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );