DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INT(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INT(11),
    stock_quantity INT(11),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Banana", "Groceries", 2.49, 3000), ("iPhone 7", "Electronics", 649, 500), ("Chicken Breast", "Groceries", 6, 1500), ("Mattress", "Furniture", 299, 800),
("Sneaker", "Fashion", 41.99, 1300), ("JavaScript: The Good Parts", "Book", 19.50, 2500), ("Multi Vitamin", "Health", 18, 750), ("Camera", "Electronics", 999, 350),
("Espresso Machine", "Kitchen", 539, 300), ("Mac Book Pro", "Electronics", 1899, 1000);

