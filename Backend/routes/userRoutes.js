const routes = require("express").Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
// Example GET /users route
routes.get("/users", userController.getAllUsers);

// Create a new user
routes.post("/users", userController.createUser);

// get the user by his id
routes.get("/users/:id", userController.getUserById);

// delete user by id
routes.delete("/users/:id", userController.deleteUserById);

// update user by id
routes.put("/users/:id", userController.updateUserById);

// User login

routes.post("/login", userController.userlogin);

module.exports = routes;
