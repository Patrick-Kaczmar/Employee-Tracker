USE Employee_Tracker;

INSERT Department (name)
VALUE 
("Sales"),
("Developer"),
("Marketing"),
("Finance"),
("Operations");

INSERT Role (Title, Salary, Department_id)
VALUE 
("Front end engineer", 50000, 2),
("Back end engineer", 70000, 2),
("Full stack developer", 110000, 2),
("Development manager", 150000, 2),
("Force representative", 45000, 1),
("Sales manager", 60000, 1),
("Marketing manager", 65000, 3),
("Marketing analyst", 55000, 3),
("Finance manager", 100000, 4),
("Budget Analyst", 63000, 4),
("Operations manager", 90000, 5),
("Coordinator", 65000, 5);

INSERT Employee (First_name, Last_name, Role_id, Manager_id)
VALUE
("Jake", "Bova", 1),
("Randy", "Gordon", 2),
("Paul", "Norman", 3),
("Joe", "Egniel", 4),
("Jordan", "Macros", 5),
("Kenny", "White", 6),
("Brian", "Armstrong", 7),
("Conner", "Wright", 8),
("Kevin", "Grace", 9),
("trevor", "Dopler", 10),
("Artimis", "Marsh", 11),
("Weston", "Flores", 12);


SELECT * FROM department;

SELECT * FROM Role;

SELECT * FROM Employee;

SELECT * FROM department;

DELETE FROM Employee WHERE id;
ALTER TABLE Employee auto_increment = 1;

SELECT * FROM Role;

SELECT * FROM Employee;