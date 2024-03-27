const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pioneer-Backend-Assignment",
      version: "1.0.0",
      description: "The assignment involves setting up user authentication with JWT, developing API endpoints to fetch data, documenting the API using Swagger for better understanding, securing API endpoints for authenticated users, and optionally, retrieving Ethereum account balances using web3.js. These tasks include creating functionalities like user registration, login, logout, fetching data with filters, JWT authentication, adding middleware, and handling errors effectively.",
    },
    servers:[
        {
            url: "https://pioneer-backend-assignment.onrender.com/"
        }
    ]
  },
  apis: ["./routes/**/*.js", "./controllers/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
