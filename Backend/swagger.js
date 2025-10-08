const swaggerAutogen = require("swagger-autogen")();

const isProduction = process.env.NODE_ENV === "production";
const renderHost = process.env.RENDER_HOST || "car-rental-si5p.onrender.com"; // Replace with your actual Render domain

const doc = {
  info: {
    title: "My API",
    description: "API documentation generated with swagger-autogen",
    version: "1.0.0",
  },
  host: isProduction ? renderHost : "localhost:30000",
  schemes: isProduction ? ["https"] : ["http"],
  basePath: "/",
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
