const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Andromeda123',
    port: 3306,
    database: 'Employee_Tracker'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    firstQuestion();
});
// Asks the first question of what the user wants to do
function firstQuestion() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add new Data", "Update data", "View data", "Delete data", "Exit"],
            name: "firstChoice"

        }
        // Branches out into separate functions depending on the users answer
    ).then(response => {
        const answer = response;

        if (answer.firstChoice === "Add new Data") {
            addNewData();
        }
        else if (answer.firstChoice === "Update data") {
            updatedata();
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
// closes the program
function exit() {
    connection.end();
    console.log("You have exited the program");
}
// asks the user what type of data they want to add
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
// asks user what to name the new department
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
// creates the data from the user input using a mysql query
function insertDepartment(data) {
    connection.query("INSERT Department SET ?", data, err => {
        if (err) return console.error(err);
        console.log(`you have created a new department called ${data.name}!`)
        firstQuestion();
    });
}
// asks the user for the new role information
function newRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new Role you want to add?",
            name: "Title",
        },
        {
            type: "input",
            message: "What is the Salary for this postion?",
            name: "Salary"
        },
        {
            type: "input",
            message: "What department does this role belong to?",
            name: "Department_id"
        }
    ]).then(answers => {
        insertRole(answers);
    });
}
// creates a new role using the user input and a mysql query
function insertRole(data) {
    connection.query("INSERT Role SET ?", data, err => {
        if (err) return console.error(err);
        console.log(`you have created a new Role called ${data.Title}, with a salary of ${data.Salary} and is part of department ${data.Department_id}!`)
        firstQuestion();
    });
}
// Asks the user for new employee information and gives a list of roles and managers to choose from 
function newEmployee() {
    connection.query("SELECT id, Title FROM role", (err, result) => {
        if (err) console.error(err);
        const roleOptions = result.map(({ id, Title }) => ({
            value: id, name: `${Title}`
        }));

        connection.query(`SELECT * FROM Employee INNER JOIN Role ON Employee.Role_id = Role.id WHERE Role.Title LIKE "%manager%"`, (err, result) => {
            if (err) console.error(err);
            const managerList = result.map(({ id, First_name, last_name }) => ({
                value: id, name: `${First_name} ${last_name}`
            }));

            inquirer.prompt([
                {
                    type: "input",
                    message: "what is the employee's first name?",
                    name: "First_name"
                },
                {
                    type: "input",
                    message: "what is the employee's last name?",
                    name: "Last_name"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roleOptions,
                    name: "Role_id",
                },
                {
                    type: "list",
                    message: "Please select this employee's manager if applicable:",
                    choices: ["NONE", ...managerList],
                    name: "Manager_id",
                }
            ]).then(input => {
                input.Manager_id === "NONE" ? input.Manager_id = null : false
                insertEmployee(input);
            });
        });
    });
}
// creates a new employee using the user input and a mysql query
function insertEmployee(data) {
    connection.query("INSERT Employee SET ?", data, err => {
        if (err) return console.error(err);
        console.log(`you have created a new Employee called ${data.First_name} ${data.Last_name}, with a role id of ${data.Role_id} and manager id of ${data.Manager_id}!`)
        firstQuestion();
    });
}
// Asks the user what type of data they wish to view
function viewData() {
    inquirer.prompt(
        {
            type: "list",
            message: "What data would you like to view?",
            choices: ["Departments", "Roles", "Employee's", "Overall data"],
            name: "viewChoice"
        }
    ).then(answer => {
        if (answer.viewChoice === "Departments") {
            viewDepartment();
        }
        else if (answer.viewChoice === "Roles") {
            viewRoles();
        }
        else if (answer.viewChoice === "Employee's") {
            viewEmployees();
        }
        else if (answer.viewChoice === "Overall data") {
            overallData();
        }
    });
}
// gets all information from the mysql department table 
function viewDepartment() {
    connection.query("SELECT * FROM Department", (err, result) => {
        if (err) return console.error(err);
        console.table(result);
        firstQuestion();
    });
}
// gets all information from the mysql role table 
function viewRoles() {
    connection.query("SELECT * FROM Role", (err, result) => {
        if (err) return console.error(err);
        console.table(result);
        firstQuestion();
    });
}
// gets all information from the mysql employee table 
function viewEmployees() {
    connection.query("SELECT * FROM Employee", (err, result) => {
        if (err) return console.error(err);
        console.table(result);
        firstQuestion();
    });
}
// gets all information from all the tables with a join query
function overallData() {
    connection.query("SELECT * FROM Department a INNER JOIN Role b ON a.id = b.Department_id INNER JOIN Employee c ON b.id = c.Role_id", (err, result) => {
        if (err) return console.error(err);
        console.table(result);
        firstQuestion();
    });
}
// asks the user what employee they want to update and with what role 
function updateRoles() {
    connection.query("SELECT id, First_name, Last_name, Role_id FROM Employee", (err, result) => {
        if (err) return console.error(err);

        const employeeChoice = result.map(({ id, First_name, Last_name, Role_id }) => ({
            value: id, name: `${First_name} ${Last_name} ${Role_id}`
        }));

        connection.query("SELECT id, Title, Salary, Department_id FROM Role", (err, result) => {
            if (err) return console.error(err);

            const roleChoice = result.map(({ id, Title, Salary, Department_id }) => ({
                value: id, name: `${Title} ${Salary} ${Department_id}`
            }));

            inquirer.prompt([
                {
                    type: "list",
                    message: "What employee would you like to update?",
                    choices: employeeChoice,
                    name: "employeeUpdate"
                },
                {
                    type: "list",
                    message: "What role would you like to give this employee?",
                    choices: roleChoice,
                    name: "roleUpdate"
                }
            ]).then(response => {
                const set = response.roleUpdate;
                const where = response.employeeUpdate;
                connection.query("UPDATE Employee SET Role_id = ? WHERE id = ?", [set, where], err => {
                    if (err) return console.error(err);
                    console.log("Employee's new role has been updated!")
                    firstQuestion();
                });
            });
        });
    });
}
// asks the user what type of data they want to delete
function deleteData() {
    inquirer.prompt([
        {
            type: "list",
            message: "What data do you want to delete from?",
            choices: ["Departments", "Roles", "Employee's"],
            name: "deleteSection",
        }
    ]).then(response => {
        if (response.deleteSection === "Departments") {
            deleteDeparment();
        }
        else if (response.deleteSection === "Roles") {
            deleteRole();
        }
        else if (response.deleteSection === "Employee's") {
            deleteEmployee();
        }
    });
}
// deletes the selected derpartment the users picks using a mysql delete query
function deleteDeparment() {
    connection.query("SELECT * FROM Department", (err, result) => {
        if (err) return console.error(err);
        const departmentList = result.map(({ id, name }) => ({
            value: id, name: `${name}`
        }));
        inquirer.prompt([
            {
                type: "list",
                message: "What department would you like to delete?",
                choices: departmentList,
                name: "departmentDelete",
            }
        ]).then(response => {
            const deleteChoice = response.departmentDelete;
            connection.query("DELETE FROM Department WHERE id = ?", [deleteChoice], err => {
                if (err) return console.error(err);
                console.log(`You have deleted a department!`)
                firstQuestion();
            });
        });
    });
}
// deletes the selected role the users picks using a mysql delete query
function deleteRole() {
    connection.query("SELECT * FROM Role", (err, result) => {
        if (err) return console.error(err);
        const RoleList = result.map(({ id, Title, Salary, Department_id }) => ({
            value: id, name: `${Title} ${Salary} ${Department_id}`
        }));
        inquirer.prompt([
            {
                type: "list",
                message: "What Role would you like to delete?",
                choices: RoleList,
                name: "RoleDelete",
            }
        ]).then(response => {
            const deleteChoice = response.RoleDelete;
            connection.query("DELETE FROM Role WHERE id = ?", [deleteChoice], err => {
                if (err) return console.error(err);
                console.log(`You have deleted a Role!`)
                firstQuestion();
            });
        });
    });
}
// deletes the selected employee the users picks using a mysql delete query
function deleteEmployee() {
    connection.query("SELECT * FROM Employee", (err, result) => {
        if (err) return console.error(err);
        const EmployeeList = result.map(({ id, First_name, last_name, Role_id, Manager_id }) => ({
            value: id, name: `${First_name} ${last_name} ${Role_id} ${Manager_id}`
        }));
        inquirer.prompt([
            {
                type: "list",
                message: "What Employee would you like to delete?",
                choices: EmployeeList,
                name: "EmployeeDelete",
            }
        ]).then(response => {
            const deleteChoice = response.EmployeeDelete;
            connection.query("DELETE FROM Employee WHERE id = ?", [deleteChoice], err => {
                if (err) return console.error(err);
                console.log(`You have deleted a Employee!`)
                firstQuestion();
            });
        });
    });
}
// asks the user what type of data to update 
function updatedata() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to update?",
            choices: ["Employee roles", "Employee managers"],
            name: "updateChoice"
        }
    ]).then(response => {
        if (response.updateChoice === "Employee roles") {
            updateRoles();
        }
        else if (response.updateChoice === "Employee managers") {
            updateManager();
        }
    });
}
// gives the user a list of employee's to choose from and a manager list to update to the chosen employee
function updateManager() {
    connection.query("SELECT id, First_name, Last_name, Role_id FROM Employee", (err, result) => {
        if (err) return console.error(err);

        const employeeChoice = result.map(({ id, First_name, Last_name, Role_id }) => ({
            value: id, name: `${First_name} ${Last_name} ${Role_id}`
        }));

        connection.query(`SELECT * FROM Employee INNER JOIN Role ON Employee.Role_id = Role.id WHERE Role.Title LIKE "%manager%"`, (err, result) => {
            if (err) console.error(err);
            const managerList = result.map(({ id, First_name, last_name }) => ({
                value: id, name: `${First_name} ${last_name}`
            }));

            inquirer.prompt([
                {
                    type: "list",
                    message: "What employee would you like to update?",
                    choices: employeeChoice,
                    name: "employeePick"
                },
                {
                    type: "list",
                    message: "Please select a new manager for this employee",
                    choices: managerList,
                    name: "managerPick",
                }
            ]).then(response => {
                const set = response.managerPick;
                const where = response.employeePick;
                connection.query("UPDATE Employee SET Manager_id = ? WHERE id = ?", [set, where], err => {
                    if (err) return console.error(err);
                    console.log("Employee's new manager id has been updated!")
                    firstQuestion();
                });
            });
        });
    });
}