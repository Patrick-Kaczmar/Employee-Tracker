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
        const answer = response;
        
        if (answer.firstChoice === "Add new Data") {
            addNewData();
        }
        else if (answer.firstChoice === "Update roles") {
            updateRoles();
        }
        else if (answer.firstChoice === "View data") {
            viewData();
        }
        else if (answer.firstChoice === "Delete data") {
            deleteData();
        }
        else {
            exit();
        }
    });
}

function exit() {
    connection.end();
    console.log("You have exited the program");
}

function addNewData() {
    inquirer.prompt(
        {
            type: "list",
            message: "Please select the data you wish to add:",
            choices: ["Department", "Roles", "Employee"],
            name: "dataChoice"
        }
    ).then(response => {
        const answer = response;

        if (answer.dataChoice === "Department") {
            console.log("Adding new department!");
            newDepartment();
        }
        else if (answer.dataChoice === "Roles") {
            console.log("Adding new Role!");
            newRole();
        }
        else if (answer.dataChoice === "Employee") {
            console.log("Adding new Employee!");
            newEmployee();
        }
    });
}

function newDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "name"
        }
    ).then(input => {
        insertDepartment(input);
    });
}

function insertDepartment(data) {
    connection.query("INSERT Department SET ?", data, err => {
        if (err) return console.error(err);
        console.log(`you have created a new department called ${data.name}!`)
        firstQuestion();
    });
}