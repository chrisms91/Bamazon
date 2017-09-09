# Bamazon

>This is an Amazon-like storefront using MySQL and node.
>The app will take in orders from customers and deplete stock from the store's inventory.
>It also tracks product sales across your store's departments and then provide a summary of the highest-grossing departments >in the store.

 
  
# Examples

### Customer
  1. Populate Mock data
  ![Mock Data](/images/mock-data.png)
  
  2. Initial Display of customer view
  ![Initial](/images/cust-initial.png)
  
  3. Prompt users with two messages (ask ID of product, number of product)
  ![Prompt](/images/cust-purchase.png)
  
  4. Error message when store doesn't have enough stock
  ![Insufficient](/images/cust-insuf.png)
  
  5. Result table after some purchases
  ![Result](/images/cust-end.png)
  

### Manager
  1. Initial Display of manager view
  ![Initial](/images/mng-initial.png)
  
  2. View Products for Sale: It lists every available item
  ![View](/images/mng-viewproduct.png)
  
  3. View Low Inventory: It lists all items with an inventory count lower than five.
  ![Low](/images/mng-viewlow.png)
  
  4. Add to Inventory: It displays a prompt that will let the manager "add more" of any item currently in the store
  ![Add](/images/mng-add.png)
  
  5. Add New Product: It adds new product in the store. When it adds new product, it also checks for department name of     product. So when department_name is not in our store, it adds into departments store. Otherwise, it only adds product itself.
  In this screenshot, **Garden** department is added into departments table when it tries to add new product **Flower**, and after that it prompts the user to enter the over head cost of the new department to fill out data in departments table. Then when it tries to add **Shovel**, since it has same department name which is Garden, it only adds into product table
  ![New](/images/mng-new.png)
  
 
 ### Supervisor
  1. Initial Display of supervisor view
  ![Initial](/images/sup-initial.png)
  
  2. View Product Sales by Department: It displays a summarized table in their terminal/bash window
  ![View](/images/sup-view.png)
  
  3. Create New Department: It creates a new department and adds into database. If department is already in database, it will prompt error message
  ![Create](/images/sup-create.png)
