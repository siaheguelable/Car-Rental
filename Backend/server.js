const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./DB/connection");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger-output.json"); // Add this line

require("dotenv").config();

connectDB();

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// The environment variables are loaded from the .env file
const port = process.env.PORT || 30000;

// The server listens on the specified port

app.listen(port, () => {
  console.log(`Server is running at : http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
