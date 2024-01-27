# E-commerce_Platform


## Description

This e-commerce platform offers users the ability to:
Browse a diverse product catalog: Explore a wide range of products conveniently.
Effortlessly manage shopping carts: Add or remove items seamlessly for a tailored shopping experience.
Enjoy a secure user authentication process: Register and login securely with email verification and JWT tokens.
Experience transparent transactions: Receive order confirmations and email notifications for a seamless checkout process.
In conclusion, this project delivers a fully functional e-commerce platform, offering users a comprehensive online shopping experience with secure authentication, efficient product management, and intuitive cart functionality.
   
## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Documentation](#api-documentation)
    - [User Management Endpoints (`user.js`)](#user-management-endpoints-userjs)
    - [Category Management Endpoints (`category.js`)](#category-management-endpoints-categoryjs)
    - [Product Management Endpoints (`product.js`)](#product-management-endpoints-productjs)
    - [Order Management Endpoints (`order.js`)](#order-management-endpoints-orderjs)
    - [Cart Management Endpoints (`cart.js`)](#cart-management-endpoints-cartjs)
4. [License](#license)


# Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/Ibadetegashi/E-commerce_Platform.git

## BACKEND
1. Install dependencies:
    
    Node.js: Ensure you have Node.js installed on your machine. You can download it from Node.js website.
    Open the terminal and navigate to the '/backend' directory. Run: <code>npm install</code> 

2. Create a .env file in the '/backend' directory and configure necessary environment variables:

- DATABASE_URL="mysql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>?schema=public" -  Connection URL for the MySQL database.
- SECRET_KEY="YOUR_SECRET_KEY" - Replace "YOUR_SECRET_KEY" with a strong and unique secret key. It's used for token.
- EMAIL="your.email@example.com" - Email address used for sending emails.
- PASSWORD="your_secure_password" - Password associated with the email address (please handle securely). Use a Unique App-Specific Password. Instead of using your primary email account password, generate a unique app-specific password specifically for sending emails through this application.
- URL="http://localhost:3000"
- PORT="3000" - Port number on which the application will run.

3. Prisma
- DATABASE_URL="mysql://username:password@localhost:3306/database_name" - Replace username, password, localhost, 3306, and database_name with your actual database credentials and configuration.

4. Apply Migrations:
- <code>npx prisma migrate dev</code>  - This command will execute the migrations defined in the prisma/migrations folder. It sets up the database schema based on the changes specified in each migration file.
Generate Prisma Client:
- <code>npx prisma generate</code> - This command generates the Prisma Client based on the schema.prisma file.
   
## FRONTEND

Angular CLI: Install Angular CLI globally : npm install -g @angular/cli
1. Open the terminal and navigate to the '/frontend' directory. Run <code>npm install</code>
2. Create a environments folder in directory /frontend/src
3. In this folder create two files:
    - src/environments/`environment.development.ts`
    - src/environments/`environment.ts` 
  ```typescript
   // src/environments/environment.development.ts

   export const environment = {
       apiUrl: 'http://localhost:3000',
   };
  ```

```typescript 
    // src/environments/environment.ts

  export const environment = {
    apiUrl: 'http://localhost:3000',
  };
```
# Usage
To start the application, run:
- /backend - <code>npm start</code>
Open your browser and visit http://localhost:3000 to access the backend API.
- /frontend - <code>ng serve</code>
Visit http://localhost:4200 to see the frontend of the application.

 
 
# API Documentation

## User Management Endpoints (user.js):
- ${\color{orange}POST}$ `/user/register`: Register a new user.
- ${\color{blue}PUT}$ `/user/:id`: Update an existing user.
- ${\color{red}DELETE}$ `/user/:id`: Delete a user.
- ${\color{green}GET}$ `/user/`: Get a list of all users (requires admin privileges).
- ${\color{green}GET}$ `/user/:id`: Get details of a specific user (requires authentication).
- ${\color{orange}POST}$ `/user/login`: Authenticate and log in a user.
- ${\color{green}GET}$ `/user/confirm/:token`: Confirm user registration via email.
- ${\color{blue}PUT}$ `/user/updateEmail/:id`: Update user email (requires authentication).
- ${\color{green}GET}$ `/user/confirm-update/:token`: Confirm email update via email.
- ${\color{red}DELETE}$ `/user/:id`: Delete a user (requires admin privileges).
- ${\color{blue}PUT}$ `/user/:id/status`: Make a user an admin (requires admin privileges).


## Category Management Endpoints (category.js):
- ${\color{orange}POST}$ `/category/`: Create a new category (requires admin privileges).
- ${\color{green}GET}$ `/category/`: Get a list of all categories (requires admin privileges).
- ${\color{green}GET}$ `/category/:id`: Get details of a specific category.
- ${\color{red}DELETE}$ `/category/:id`: Delete a category (requires admin privileges).
- ${\color{blue}PUT}$ `/category/:id`: Update an existing category (requires admin privileges).

## Product Management Endpoints (`product.js`):
- ${\color{orange}POST}$ `/product/`: Create a new product (requires admin privileges).
- ${\color{green}GET}$ `/product/`: Get a list of all products.
- ${\color{green}GET}$ `/product/:id`: Get details of a specific product.
- ${\color{red}DELETE}$ `/product/:id`: Delete a product (requires admin privileges).
- ${\color{blue}PUT}$ `/product/:id`: Update an existing product (requires admin privileges).
- ${\color{blue}PUT}$ `/product/category`: Set the category for a product (requires admin privileges).

## Order Management Endpoints (`order.js`):
Order Management Endpoints (order.js):
- ${\color{orange}POST}$ `/order/`: Create a new order. (requires authentication)
- ${\color{green}GET}$ `/order/`: Get a list of all orders. (requires admin privileges)
- ${\color{green}GET}$ `/order/:id`: Get details of a specific order. (requires authentication)
- ${\color{blue}PUT}$ `/order/:id`: Update the status of a specific order. (requires admin privileges)
- ${\color{red}DELETE}$ `/order/:id`: Delete a specific order. Associated order items will be deleted. (requires admin privileges)
- ${\color{green}GET}$ `/order/get/total`: Get the total sum of all orders and the total orders. (requires admin privileges)
- ${\color{green}GET}$ `/order/orderitems/:id`: Get the order items for a specific order. (requires authentication)
- ${\color{green}GET}$ `/order/confirmOrder/:orderId`: Confirm an order.
- ${\color{green}GET}$ `/order/cancelOrder/:orderId`: Cancel an order. 

## Cart Management Endpoints (`cart.js`):
- ${\color{orange}POST}$ `/cart/`: Add a product to the user's cart (requires authentication).
- ${\color{red}DELETE}$ `/cart/:productId`: Remove a specific product from the user's cart (requires authentication).
- ${\color{green}GET}$ `/cart/`: Get the cart items of the logged-in user (requires authentication).
- ${\color{green}GET}$ `/cart/emptyCart`: Empty the cart of the logged-in user (requires authentication). Deletes the cart


# LICENSE
This project is licensed under the MIT License.