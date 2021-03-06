var mysql = require('mysql');
var inquirer = require('inquirer');

// create connection with mysql database
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    mainPrompt();
});

//main prompt
function mainPrompt() {
    inquirer.prompt([
        {
            name: "option",
            message: "Bamazon Manager Options...",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(result){
        if (result.option === "View Products for Sale"){
            displayProducts();
        } else if (result.option === "View Low Inventory"){
            viewLowInventory();
        } else if (result.option === "Add to Inventory"){
            addInventory();
        } else if (result.option === "Add New Product"){
            newInventory();
        } 
    });
}

function displayProducts() {
    var queryString = "select * from products";

    con.query(queryString, function(err, result){
        if (err) throw err;

        console.log("\nList of every available item")
        console.log("\n|------------------------------------------------------------------------------------------------------|");
        console.log("| item_id  | product_name                    | department_name       | price     | stock_quantity      |");

        for(var i=0; i<result.length; i++){
            console.log("|------------------------------------------------------------------------------------------------------|");
            console.log("|" + createWhiteSpace(result[i].item_id, 9) + "|" + createWhiteSpace(result[i].product_name, 32) + "|" 
                   + createWhiteSpace(result[i].department_name, 22) + "|" + " $" + createWhiteSpace(result[i].price, 8) + "|" + createWhiteSpace(result[i].stock_quantity, 20) + "|");
        }
        console.log("|------------------------------------------------------------------------------------------------------|\n");
        setTimeout(mainPrompt, 1500);
    });
}

//Generates empty space depends on item length.
function createWhiteSpace(item, sectionSize){
    if(typeof item === "number"){
        var numString = item.toString();
        var spaceLength = sectionSize - numString.length;
    } else {
        var spaceLength = sectionSize - item.length;
    }
    
    var display = " " + item + new Array(spaceLength).join(" ") + " ";
    return display;
}

function viewLowInventory() {
    var queryString = "select * from products where stock_quantity < 5";

    con.query(queryString, function(err, result){
        if (err) throw err;

        console.log("\nList of all items with an inventory count lower than five");
        console.log("\n|------------------------------------------------------------------------------------------------------|");
        console.log("| item_id  | product_name                    | department_name       | price     | stock_quantity      |");

        for(var i=0; i<result.length; i++){
            console.log("|------------------------------------------------------------------------------------------------------|");
            console.log("|" + createWhiteSpace(result[i].item_id, 9) + "|" + createWhiteSpace(result[i].product_name, 32) + "|" 
                   + createWhiteSpace(result[i].department_name, 22) + "|" + " $" + createWhiteSpace(result[i].price, 8) + "|" + createWhiteSpace(result[i].stock_quantity, 20) + "|");
        }
        console.log("|------------------------------------------------------------------------------------------------------|\n");
        setTimeout(mainPrompt, 1500);
    })
}

function addInventory() {
    inquirer.prompt([
        {
            name: "id",
            message: "Enter product ID you would like to add: ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            name: "qty",
            message: "How much would you like to add? "
        }
    ]).then(function(result){
        var queryString = "select * from products";
        var productArr = [];
        var isValidId = false;
        var chosenId = parseInt(result.id);
        var chosenQty = parseInt(result.qty);

        con.query(queryString, function(err, result){
            if(err) throw err;
            for(var i=0; i<result.length; i++){
                productArr.push(result[i]);
                if (result[i].item_id === chosenId){
                    isValidId = true;
                }
            }
            
            if (isValidId) {
                updateAdd(productArr , chosenId, chosenQty);
            } else {
                console.log("\nCouldn't find the product ID from our inventory, Please Try Again\n");
                setTimeout(mainPrompt, 1500);
            }
        });
    })
}

function updateAdd(items, id, qty) {
    var productArr = items;
    var productId = id;
    var updateQty = qty;
    
    var queryString = "update products set ? where ?";
    var newQty = productArr[productId-1].stock_quantity + updateQty;
    var query = con.query(queryString, [{stock_quantity: newQty}, {item_id: productId}], function(err, result){
        if (err) throw err; 
        console.log("\nAdded " + updateQty + " " + productArr[productId-1].product_name + " to inventory!\n");
        console.log("\nUpdated Stock Quantity:  " + newQty + "\n");
        setTimeout(mainPrompt, 1500);
    });
}

function newInventory() {
    console.log("\bAdding New Item....")
    inquirer.prompt([
        {
            name: "name",
            message: "Enter the product name you would like to add: "
        },
        {
            name: "department",
            message: "Enter the department name of your new product: "
        },
        {
            name: "price",
            message: "Enter the price of new product: ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            name: "stock",
            message: "Enter the stock quantity of new product: ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(result){
        insertProduct(result);
    });
}

function insertProduct(result) {
    var queryString = "insert into products set ?";
    con.query(queryString, [{product_name: result.name, department_name: result.department, price: result.price, stock_quantity: result.stock}], function(err,rst){
        if (err) throw err;
        console.log("\nNew item is successfully added into inventory\n");
        grabDptName(result.department);
    });
}

function grabDptName(newDptName){
    var dptArr = [];
    var queryString = "select distinct department_name from departments";
    var query = con.query(queryString, function(err, result){
        if (err) throw err;
        for (var i=0; i<result.length; i++){
            dptArr.push(result[i].department_name);
        }
        updateDptName(dptArr, newDptName);
    });
}

function updateDptName(dptArr, newDptName){
    var isDup = false;
    for (var i=0; i<dptArr.length; i++){
        if(dptArr.indexOf(newDptName) === -1){
            isDup = true;
        } 
    }
    if (isDup){
        var queryString = "insert into departments set ?";
        con.query(queryString, [{department_name: newDptName}]);
        console.log("\nUpdate " + newDptName + " in departments table, please set the over_head_cost for this department \n");
        updateDptOhc(newDptName);
    } else {
        setTimeout(mainPrompt, 1500);
    }
}

function updateDptOhc(newDptName) {
    inquirer.prompt([
        {
            name: "ohc",
            message: "Enter the over_head_cost for this department: ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(result){
        var queryString = "update departments set ? where ?";
        var query = con.query(queryString, [{over_head_cost: result.ohc},{department_name: newDptName}], function(err, rst){
            if(err) throw err;
            console.log("\n New department " + newDptName + " is added into table successfully!\n");
            setTimeout(mainPrompt, 1500);
        })
    })
}

