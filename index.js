const hbs = require("hbs")
const wax = require("wax-on")

const express = require('express');
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.use(express.urlencoded());

async function main() {
    app.get('/', function(req,res){
        res.send("Hello world");
    })
}
main()

app.listen(3000, ()=>{
    console.log("server has started")
})