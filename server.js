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
    firstQuestion();
});

function firstQuestion() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add new Data", "Update roles", "View data", "Delete data", "Exit"],
            name: "firstChoice"

        }
    ).then(response => {
        const { answer } = response;
        
        if (answer === "Add new Data") {
            addNewData();
        }
        else if (answer === "Update roles") {
            updateRoles();
        }
        else if (answer === "View data") {
            viewData();
        }
        else if (answer === "Delete data") {
            deleteData();
        }
        else {
            exit();
        }
    });
}

function exit() {
    connection.end();
    console.log("You have exited the program")
}