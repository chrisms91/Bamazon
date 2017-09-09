var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection with mysql database
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
    multipleStatements: true
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
            message: "Bamazon Supervisor Options...",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(result){
        if (result.option === "View Product Sales by Department"){
            viewProductSales();
        } else if (result.option === "Create New Department"){
            createDepartment();
        }
    });
}

function viewProductSales() {
    var queryString = "SELECT * FROM departments order by department_name; SELECT department_name, SUM(product_sales) as 'product_sales' FROM products GROUP BY department_name"
    var query = con.query(queryString, function(err, result){
        if(err) throw err;
        
        var dpTable = result[0];
        var totalProductSales = result[1];
        
        console.log("\n|----------------------------------------------------------------------------------------------------|");
        console.log("| department_id  | department_name       | over_head_costs     | product_sales      | total_profit   |");
        for (var i=0; i<dpTable.length; i++){
            var ohc = dpTable[i].over_head_cost;
            var ps = totalProductSales[i].product_sales;
            var tp = ps - ohc;

            console.log("|----------------------------------------------------------------------------------------------------|");
            console.log("|" + createWhiteSpace(dpTable[i].department_id, 15) + "|" + createWhiteSpace(dpTable[i].department_name, 22)
                + "|" + createWhiteSpace(dpTable[i].over_head_cost, 20) + "|" + createWhiteSpace(totalProductSales[i].product_sales, 19)
                + "|" + createWhiteSpace(tp, 15) + "|");
        }
        console.log("|----------------------------------------------------------------------------------------------------|");
    })
}

function createDepartment() {
    console.log("\nCreating new department...\n");
    inquirer.prompt([
        {
            name: "name",
            message: "Enter the department name you would like to create "
        },
        {
            name: "over_head_cost",
            message: "Enther the over head cost of new department ",
            validate: function(id){
                if(parseInt(id) === NaN){
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then (function(result){
        var queryString = "insert into departments set ?";
        con.query(queryString, [{department_name: result.name, over_head_cost: result.over_head_cost}], function(err, result){
            if (err) throw err;
            console.log("\nNew department is successfully added\n");
            setTimeout(mainPrompt, 1500);
        })
    })
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