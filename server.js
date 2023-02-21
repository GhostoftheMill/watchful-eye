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
  db.query('SELECT * FROM employees JOIN roles ON roles.id=employees.role_id ', function (err, res) {
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

};
// choose update employee role -> prompted to select employee to update and their role is updated
function updateEmp () {

};

startMenu();

//Code below here is from mini project, here as a reference for time being
// Create a movie
app.post('/api/new-movie', ({ body }, res) => {
  const sql = `INSERT INTO movies (movie_name)
    VALUES (?)`;
  const params = [body.movie_name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Read all movies
app.get('/api/movies', (req, res) => {
  const sql = `SELECT id, movie_name AS title FROM movies`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a movie
app.delete('/api/movie/:id', (req, res) => {
  const sql = `DELETE FROM movies WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Read list of all reviews and associated movie name using LEFT JOIN
app.get('/api/movie-reviews', (req, res) => {
  const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// BONUS: Update review name
app.put('/api/review/:id', (req, res) => {
  const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
  const params = [req.body.review, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
