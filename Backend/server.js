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
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:30000"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Replace with your frontend URL
  optionsSuccessStatus: 200,
};

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", userRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);
// The environment variables are loaded from the .env file
const port = process.env.PORT || 30000;
const host = process.env.HOST || "localhost";

// The server listens on the specified port

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
  console.log(`Swagger docs at http://${host}:${port}/api-docs`);
});
