const express = require('express');
const hbs = require("hbs")
const wax = require("wax-on")
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
const momentHandler = require('handlebars.moment')
momentHandler.registerHelpers(hbs)
dotenv.config();

const handlebarHelpers = require('handlebars-helpers')({
    'handlebars': hbs.handlebars
});
let app = express();
app.use(express.urlencoded({ extended: false }));

// Set up Handlebars
app.set('view engine', 'hbs');

// Use Wax-On for additional Handlebars helpers
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');


// Here is the main function where all the routes go

async function main() {

    const connection = await mysql2.createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })

    // Homepage
    app.get('/', function (req, res) {
        res.render("index");
    })  

    // SEARCH route
    // const searchRoute = [req.params.res]
    app.post(`/`, async (req, res) => {
        let sql = `SELECT event.*, organiser.name AS organiser_name, 
        organiser.email AS organiser_email, 
        organiser.contact_number AS organiser_contact_number, participant.* 
        FROM event JOIN organiser
        ON event.organiser_id = organiser.organiser_id
        JOIN participant
        ON event.participant_id = participant.participant_id
        WHERE 1
        `
        const bindings = []
        if (req.body.searchTerms) {
            sql += ` AND (title LIKE ? OR organiser.name LIKE ? OR participant.name LIKE ?) ORDER BY event_id ASC`
            bindings.push(`%${req.body.searchTerms}%`);
            bindings.push(`%${req.body.searchTerms}%`);
            bindings.push(`%${req.body.searchTerms}%`);
        }

        const [event] = await connection.execute(sql, bindings)
        res.render('index', {
            event
        });
    })

    // GET READ organiser route
    app.get("/organiser", async (req, res) => {
        let query = `SELECT * FROM organiser`
        const [organiser] = await connection.execute(query)
        res.render("organiser/index", {
            organiser
        })
    })

    // GET CREATE organiser route
    app.get("/organiser/create", async (req, res) => {
        let query = `SELECT * FROM organiser`
        const [organiser] = await connection.execute(query)
        res.render("organiser/create", {
            organiser
        })
    })

    // POST CREATE organiser route
    // process the form to create a new customer
    app.post('/organiser/create', async function (req, res) {
        // USING PRPEARED SQL STATEMENTS
        const { name, contact_number, email } = req.body;
        const query = `
             INSERT INTO organiser (name, contact_number, email) 
             VALUES (?, ?, ?)
        `;
        // prepare the values in order of the question marks in the query
        const bindings = [name, parseInt(contact_number), email];
        await connection.execute(query, bindings);
        res.redirect('/organiser');
    });

    // PUT UPDATE organiser route
    app.get("/organiser/:organiser_id/update", async (req, res) => {
        const query = `SELECT * FROM organiser WHERE organiser_id = ?`;
        const [organisers] = await connection.execute(query, [req.params.organiser_id])
        const organiser = organisers[0]
        res.render("organiser/update", {
            organiser
        })
    })

    app.post("/organiser/:organiser_id/update", async (req, res) => {
        const { name, contact_number, email } = req.body
        const organiser_id = parseInt(req.params.organiser_id)
        console.log(req.params.organiser_id)
        const query = `
        UPDATE organiser SET name=?, contact_number=? , email=?, organiser_id=?
        WHERE organiser_id= ? 
        `
        const bindings = [name, parseInt(contact_number), email, organiser_id, organiser_id]
        console.log(bindings)
        await connection.execute(query, bindings);
        res.redirect("/organiser")
    })

    // DELETE organiser route
    app.get("/organiser/:organiser_id/delete", async (req, res) => {
        const sql = `SELECT * FROM organiser WHERE organiser_id = ?`;
        const [organisers] = await connection.execute(sql, [req.params.organiser_id])
        const organiser = organisers[0]
        res.render("organiser/delete", {
            organiser
        })
    })

    app.post("/organiser/:organiser_id/delete", async (req, res) => {
        const query = `DELETE FROM organiser WHERE organiser_id = ?`
        await connection.execute(query, [req.params.organiser_id])
        res.redirect('/organiser');
    })



    // GET READ participant route
    app.get("/participant", async (req, res) => {
        let query = `SELECT * FROM participant`
        const [participant] = await connection.execute(query)
        res.render("participant/index", {
            participant
        })
    })

    // GET READ EVENT route
    app.get("/event", async (req, res) => {
        let query = `SELECT event.*, organiser.name AS organiser_name, 
        organiser.email AS organiser_email, 
        organiser.contact_number AS organiser_contact_number, participant.* 
         FROM event JOIN organiser
        ON event.organiser_id = organiser.organiser_id
        JOIN participant
        ON event.participant_id = participant.participant_id
        ORDER BY event_id
        `
        const [event] = await connection.execute(query);
        res.render("event/index", {
            event
        })
    })

    // CREATE event route
    app.get("/event/create", async (req, res) => {
        const [event] = await connection.execute(`
        SELECT * FROM event`)
        const [organiser] = await connection.execute(`SELECT * FROM organiser`)
        const [participant] = await connection.execute(`SELECT * FROM participant`)
        res.render("event/create", {
            event, organiser, participant
        })
    })


    app.post("/event/create", async (req, res) => {
        const title = req.body.title
        // change date from form to database format
        const unformatedDateString = `${req.body.date} ${req.body.time}`
        const joinedDateTime = new Date(unformatedDateString)
        const formattedDate = formatDate(joinedDateTime)
        const date_time = formattedDate
        const location = req.body.location
        const participant_id = req.body.participant_id
        const organiser_id = req.body.organiser_id
        const query = `INSERT INTO event (title, date_time, location, participant_id, organiser_id)
        VALUES (?, ?, ?, ?, ?)`
        const bindings = [title, date_time, location, participant_id, organiser_id]
        const [result] = await connection.execute(query, bindings)
        res.redirect('/event')
    })

    // UPDATE
    app.get("/event/:event_id/update", async (req, res) => {
        let query = `SELECT event.* , organiser.name AS organiser_name,
        organiser.contact_number AS organiser_contact_number,
        organiser.email AS organiser_email
        , participant.* FROM event JOIN organiser
        ON event.organiser_id = organiser.organiser_id
        JOIN participant ON event.participant_id = participant.participant_id
        WHERE event_id = ?`

        // organiser query without event organiser
        const organiserQuery = `SELECT  organiser.*
        FROM organiser WHERE
        organiser_id NOT IN (
            SELECT event.organiser_id FROM event
            WHERE event_id = ?
        )
       `
        const participantQuery = `SELECT participant.*
        FROM participant
        WHERE participant_id NOT IN (
            SELECT event.participant_id FROM event
            WHERE event_id = ?
        )`
        const [events] = await connection.execute(query, [req.params.event_id]);
        const event = events[0]
        const [organiser] = await connection.execute(organiserQuery, [req.params.event_id])
        const [participant] = await connection.execute(participantQuery, [req.params.event_id])
        const eventDateTime = event.date_time.toISOString().split('T')
        event.date = eventDateTime[0]
        event.time = eventDateTime[1].slice(0, -5);
        res.render("event/update", {
            event, organiser, participant
        })
    })

    app.post("/event/:event_id/update", async (req, res) => {
        const title = req.body.title
        // change date from form to database format
        const unformatedDateString = `${req.body.date} ${req.body.time}`
        const joinedDateTime = new Date(unformatedDateString)
        const formattedDate = formatDate(joinedDateTime)
        const date_time = formattedDate
        const location = req.body.location
        const participant_id = req.body.participant_id
        const organiser_id = req.body.organiser_id
        const query = `UPDATE event set title = ?, date_time =? , location=?, participant_id=?, organiser_id=?
        WHERE event_id = ?`
        const bindings = [title, date_time, location, participant_id, organiser_id, parseInt(req.params.event_id)]
        await connection.execute(query, bindings)
        res.redirect("/event")

    })

    app.post("/organiser/:organiser_id/update", async (req, res) => {
        const { name, contact_number, email } = req.body
        const organiser_id = parseInt(req.params.organiser_id)
        console.log(req.params.organiser_id)
        const query = `
        UPDATE organiser SET name=?, contact_number=? , email=?, organiser_id=?
        WHERE organiser_id= ? 
        `
        const bindings = [name, parseInt(contact_number), email, organiser_id, organiser_id]
        console.log(bindings)
        await connection.execute(query, bindings);
        res.redirect("/organiser")
    })

    // DELETE event route
    app.get("/event/:event_id/delete", async (req, res) => {
        const sql = `SELECT * FROM event WHERE event_id = ?`;
        const [events] = await connection.execute(sql, [req.params.event_id])
        const event = events[0]
        res.render("event/delete", {
            event
        })
    })

    app.post("/event/:event_id/delete", async (req, res) => {
        const query = `DELETE FROM event WHERE event_id = ?`
        await connection.execute(query, [req.params.event_id])
        res.redirect('/event');
    })


}

main()

app.listen(3000, () => {
    console.log("server has started")
})

//Functions to make SQL searching easier
function findById(tableName, table_id) {
    return `SELECT * FROM ${tableName} WHERE ${table_id} = ?`
}


// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}