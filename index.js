const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'C@$t@n3@',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

function startMenu () {
    inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'Choose an action.',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
    }).then( answer => {
        switch (answer.menu) {
            case 'View all departments':
                viewDepts();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmps();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmp();
                break;
            case 'Update an employee':
                updateEmp();
                break;
        }
    })
};

// choose all depts -> table w/ dept names & dept ids
function viewDepts() {
  db.query('SELECT * FROM departments', function (err, res) {
    console.log(res);
    startMenu();
  })
};
// choose all roles -> table w/ job title, role id, dept, salary
function viewRoles() {
  db.query('SELECT * FROM roles', function (err, res) {
    console.log(res);
    startMenu();
  })
};
// choose all employees -> 
// table w/ employee ids, first name, last name, job title, dept, salaries, managers
function viewEmps () {
  db.query('SELECT * FROM employees JOIN roles ON roles.id=employees.role_id', function (err, res) {
    console.log(res);
    startMenu();
  })
};
// choose add dept -> prompts:
// enter name of dept
// it is added to database
function addDept () {
  inquirer.prompt({
    type: 'input',
    name: 'dept_name',
    message: 'Enter new department.'
  }).then( answer => {
      db.query('INSERT INTO departments (dept_name) VALUES (?)', answer.dept_name, function (err, res) {
        console.log('Department has been added.');
        viewDepts();
      }) 
  })
};
// choose add role -> prompts:
// enter name of role
// enter salary
// dept for that role
// it is added to database
function addRole () {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: 'Enter new role title.'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Enter salary.'
  },
  {
    type: 'menu',
    name: 'dept_id',
    message: 'Choose department for role.',
    choices: [1, 2, 3]
  },
  ).then( answer => {
      db.query('INSERT INTO roles (title, salary, dept_id) VALUES (?)', answer.title, answer.salary, answer.dept_id, function (err, res) {
        console.log('New role has been added.');
        viewRoles();
      }) 
  })
};
// choose add employee -> prompts: 
// enter first name
// enter last name
// enter role
// enter manager
// it is added to database
function addEmp () {
    inquirer.prompt({
      type: 'input',
      name: 'first_name',
      message: `Enter employee's first name.`
    },
    {
      type: 'input',
      name: 'last_name',
      message: `Enter employee's last name.`
    },
    {
      type: 'menu',
      name: 'role_id',
      message: 'Choose role.',
      choices: ['Leader', 'Support']
    },
    {
      type: 'menu',
      name: 'manager_id',
      message: 'Assign manager. 1- Street Level, 2- Superhero, 3- Intergalatic',
      choices: [1, 2, 3]
    }
    ).then( answer => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)', answer.first_name, answer.last_name, answer.role_id, answer.manager_id, function (err, res) {
          console.log('New employee has been added.');
          viewEmps();
        }) 
    })
  };
// choose update employee role -> prompted to select employee to update and their role is updated
function updateEmp () {
  inquirer.prompt({
        name: "first_name",
        type: "input",
        message: "Enter first name of employee to update."
    },
    {
        name: "role_id",
        type: "number",
        message: "Enter new role. 1- Street Level, Leader. 2-Street Level, Support, 3- Superhero, Leader, 4- Superhero, Support, 5- Intergalatic, Leader, 6- Intergalatic, Support."
    }
    ).then(function (answer) {
    db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [answer.role_id, answer.first_name], function (err, data) {
        console.log('Employee updated successfully.');
        viewEmps();
        startMenu();
        });
    })
};


startMenu();
