const express = require('express');
const hbs = require("hbs")
const wax = require("wax-on")
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
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



    app.get('/', function (req, res) {
        res.render("index");
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