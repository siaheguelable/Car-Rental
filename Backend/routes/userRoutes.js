const routes = require("express").Router();
const userController = require("../controllers/userController");

// Example GET /users route
routes.get("/users", (req, res) => {
  res.json({ message: "Users route works!" });
});

// Create a new user
routes.post("/users", userController.createUser);

// User login

routes.post("/login", userController.userlogin);

module.exports = routes;
