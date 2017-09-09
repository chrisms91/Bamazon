DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INT(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INT(11),
    stock_quantity INT(11),
	product_sales INT(11) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INT(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100),
    over_head_cost INT (11),
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Banana", "Groceries", 2.49, 3000), ("iPhone 7", "Electronics", 649, 500), ("Chicken Breast", "Groceries", 6, 1500), ("Mattress", "Furniture", 299, 800),
("Sneaker", "Fashion", 41.99, 1300), ("JavaScript: The Good Parts", "Book", 19.50, 2500), ("Multi Vitamin", "Health", 18, 750), ("Camera", "Electronics", 999, 350),
("Espresso Machine", "Kitchen", 539, 300), ("Mac Book Pro", "Electronics", 1899, 1000), ("Lotion", "Beauty", 8.54, 4), ("Perfume", "Beauty", 44, 3), ("Beer", "Groceries", 9.99, 2);

-- department name
 insert into departments (department_name)
 select distinct department_name from bamazon.products where department_name NOT IN (SELECT department_name FROM departments);
 
 -- departments over_head_costs
update departments set over_head_cost = 5000 where department_id = 1;
update departments set over_head_cost = 400000 where department_id = 2;
update departments set over_head_cost = 300000 where department_id = 3;
update departments set over_head_cost = 30000 where department_id = 4;
update departments set over_head_cost = 25000 where department_id = 5;
update departments set over_head_cost = 8000 where department_id = 6;
update departments set over_head_cost = 100000 where department_id = 7;
update departments set over_head_cost = 60 where department_id = 8;
