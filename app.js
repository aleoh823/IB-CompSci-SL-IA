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
        event_id, event, DATE_FORMAT(date, "%m/%d/%y") as date, CONCAT(TIME_FORMAT(f_time, "%I:%i"), " - " , TIME_FORMAT(t_time, "%I:%i %p")) as time, location, avail_slots, description
    FROM
        event
    ORDER BY
        date, time
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
app.get( "/admin", ( req, res ) => {
    db.execute(read_event_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.render('admin', { inventory : results });
        }
    });
} );

const read_event_sql = `
    SELECT 
        event_id, event, DATE_FORMAT(date, "%m/%d/%y") as date, f_time, t_time, location, avail_slots, description
    FROM
        event
    WHERE 
        event_id = ?
`
// define a route for the item detail page
app.get( "/admin/details/:id", ( req, res ) => {
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
            res.render('details', data);         }
    });
});

// define a route for the volunteer view modal
const read_volunteer_all_sql = `
    SELECT 
        v.volunteer_id, fName, lName, email, phone, volunteers, comment
    FROM
        volunteer v
    
    WHERE v.event_id = ?
    
    ORDER BY 
        lName, fName
`
app.get( "/main/signup/:id", ( req, res ) => {
    db.execute(read_event_sql, [req.params.id], (error, results1) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else if (results1.length == 0) {
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        }
        else {
            db.execute(read_volunteer_all_sql, [req.params.id], (error, results2) => {
                if (error)
                    res.status(500).send(error); //Internal Server Error
                else {
                    res.render('signup', { data : results1[0], inventory1: results2 });
                }
            });
        }
    });

} );

// const read_volunteer_sql = `
//     SELECT 
//         fName, lName, email, phone, volunteers, comment
//     FROM
//         volunteer
//     ORDER BY 
//         volunteer_id = ?
// `
// app.get( "/main/signup/:id", ( req, res ) => {
//     db.execute(read_volunteer_sql, [req.params.id, req.body.volunteer_id], (error, results) => {
//         if (error)
//             res.status(500).send(error); //Internal Server Error
//         else if (results.length == 0)
//             res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
//         else {
//             let data1 = results[0]; // results is still an array
//             data1["id"] = req.body.volunteer_id;
//             // data's object structure: 
//             //  { item: ___ , quantity:___ , description: ____ }
//             res.render('signup', data1);         }
//     });
// });


// define a route for item DELETE
const delete_event_sql = `
    DELETE 
    FROM
        event
    WHERE
        event_id = ?
`
app.get("/admin/details/:id/delete", ( req, res ) => {
    db.execute(delete_event_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/admin");
        }
    });
})

// define a route for item Create
const insert_event_sql = `
    INSERT INTO event
        (event, date, f_time, t_time, location, avail_slots)
    VALUES
        (?, ?, ?, ?, ?, ?)
`
app.post("/admin", ( req, res ) => {
    console.log(req.body);
    db.execute(insert_event_sql, [req.body.name, req.body.date, req.body.f_time, req.body.t_time, req.body.location, req.body.avail_slots], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/admin/details/${results.insertId}`);
        }
    });
})

// define a route for volunteer Create
const insert_volunteer_sql = `
    INSERT INTO volunteer
        (fName, lName, email, phone, volunteers, comment, event_id)
    VALUES
        (?, ?, ?, ?, ?, ?, ?)
`
app.post("/main/signup/:id", ( req, res ) => {
    console.log(req.body);
    db.execute(insert_volunteer_sql, [req.body.fName, req.body.lName, req.body.email, req.body.phone, req.body.volunteers, req.body.comment, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/main/signup/${req.params.id}`);
        }
    });
});

// define a route for item UPDATE
const update_event_sql = `
    UPDATE
        event
    SET
        event = ?,
        date = ?,
        f_time = ?,
        t_time = ?,
        location = ?,
        avail_slots = ?,
        description = ?
    WHERE
        event_id = ?
`
app.post("/main/details/:id", ( req, res ) => {
    db.execute(update_event_sql, [req.body.name, req.body.date, req.body.f_time, req.body.t_time, req.body.location, req.body.vol_slots, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/main/details/${req.params.id}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );