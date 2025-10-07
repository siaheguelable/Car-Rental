const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "API documentation generated with swagger-autogen",
    version: "1.0.0",
  },
  //the link is
  host: process.env.RENDER_HOST || "localhost:30000",
  schemes: process.env.RENDER_SCHEME ? [process.env.RENDER_SCHEME] : ["http"],
  basePath: "/",
};

const outputFile = "./swagger-output.json";
// Scan both server.js and routes/user.js!
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
