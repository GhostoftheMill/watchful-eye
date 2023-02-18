INSERT INTO departments (dept_name)
VALUES ("Street Level"),
       ("Superhero"),
       ("Intergalatic");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Leader", 500000, 1),
       ("Support", 100000, 1),
       ("Leader", 1000000, 2),
       ("Support", 250000, 2),
       ("Leader", 2000000, 3),
       ("Support", 500000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Kit", "Walker", 1, NULL),
       ("Cliff", "Secord", 2, 1),
       ("Tom", "Mayflower", 2, 1),
       ("Nathaniel", "Finch", 2, 1),
       ("Steve", "Rogers", 3, NULL),
       ("Thor", "Odinson", 4, 5),
       ("Bruce", "Banner", 4, 5),
       ("Tony", "Stark", 4, 5),
       ("Chris", "Powell", 5, NULL),
       ("Richard", "Rider", 6, 9),
       ("Norrin", "Radd", 6, 9),
       ("Carol", "Danvers", 6, 9);