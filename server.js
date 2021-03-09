const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Andromeda123',
    port: 3306,
    database: 'Employee_Tracker'
});

connection.connect( (err) => {
    if (err) throw err;
    // console.log('u r connect yep')
})