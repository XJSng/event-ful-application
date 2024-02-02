const hbs = require("hbs")
const wax = require("wax-on")

const express = require('express');
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.use(express.urlencoded());


// Here is the main function where all the routes go

async function main() {

    const connection = await mysql2.createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })

app.get("/organiser", async (req,res)=>{
    let query = `SELECT * FROM organiser`
    const organiser = await connection.execute(query)
    res.json(organiser[0])
})

    app.get('/', function (req, res) {
        res.send("Hello world");
    })
}
main()

app.listen(3000, () => {
    console.log("server has started")
})