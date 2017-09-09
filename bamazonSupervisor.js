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
    var queryString = "SELECT "
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