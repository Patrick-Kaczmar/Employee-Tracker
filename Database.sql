CREATE DATABASE Employee_Tracker;

USE Employee_Tracker;

CREATE TABLE Department (
id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE Role (
id INTEGER AUTO_INCREMENT NOT NULL,
Title VARCHAR(30) NOT NULL,
Salary DOUBLE NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE Employee (
id INTEGER AUTO_INCREMENT NOT NULL,
First_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
Role_id INTEGER NOT NULL,
Manager_id INTEGER,
PRIMARY KEY(id)
);