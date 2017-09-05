var mysql = require('mysql');
var inquirer = require('inquirer');

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
    displayProducts();
});

// This function display products in database, and save product ID in array
function displayProducts() {
    var productArr = [];
    var queryString = "select * from products";

    con.query(queryString, function(err, result){
        if (err) throw err;

        console.log("|------------------------------------------------------------------------------------------------------|");
        console.log("| item_id  | product_name                    | department_name       | price     | stock_quantity      |");

        for(var i=0; i<result.length; i++){
            productArr.push(result[i]);

            console.log("|------------------------------------------------------------------------------------------------------|");
            console.log("|" + createWhiteSpace(result[i].item_id, 9) + "|" + createWhiteSpace(result[i].product_name, 32) + "|" 
                   + createWhiteSpace(result[i].department_name, 22) + "|" + createWhiteSpace(result[i].price, 10) + "|" + createWhiteSpace(result[i].stock_quantity, 20) + "|");
        }
        console.log("|------------------------------------------------------------------------------------------------------|");

        promptID(productArr);
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

function promptID(items){
    var productArr = items;

    inquirer.prompt([
        {
            name: "id",
            message: "Enter the product ID you would like to purchase: ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(result){
        console.log("\nChecking our inventory for product ID: " + result.id + "...\n");
        var chosenArr = [];

        for(var i=0; i<productArr.length; i++){
            if(parseInt(result.id) === productArr[i].item_id){
                chosenArr.push(productArr[i]);
            }
        }

        if (chosenArr.length === 1) {
            promptQuantity(chosenArr);
        } else {
            console.log("\nCouldn't find the product ID from our inventory, Please Try Again\n");
            setTimeout(displayProducts, 1500);
        }
    })
}

function promptQuantity(arr) {
    var chosenItem = arr[0];

    inquirer.prompt([
        {
            name: "quantity",
            message: "How many units would you want to purchase? ",
            validate: function(qty){
                if(parseInt(qty) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(result){
        
        var parsedQty = parseInt(result.quantity);
        if(parsedQty > chosenItem.stock_quantity){
            console.log("\nInsufficient Quantity! Please Try Again\n");
            setTimeout(displayProducts, 1500);
        } else {
            var queryString = "UPDATE products SET ? WHERE ?";
            var newQty = chosenItem.stock_quantity - parsedQty;

            var query = con.query(queryString, [{stock_quantity: newQty}, {item_id: chosenItem.item_id}], function(err, result){
                if(err) throw err;

                console.log("\nPurchase Completed! Thank you :)\n");
                console.log("Updated Stock Quantity: " + newQty);
                setTimeout(displayProducts, 1500);
            });
            console.log(query.sql);
        }
    })
}
