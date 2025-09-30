const routes = require("express").Router();
const carController = require("../controllers/carController");
// Create a new car
routes.post("/cars", carController.createCar);
// Get all cars
routes.get("/cars", carController.getAllCars);
// Get a car by ID
routes.get("/cars/:id", carController.getCarById);
// Update a car by ID
routes.put("/cars/:id", carController.updateCarById);
// Delete a car by ID
routes.delete("/cars/:id", carController.deleteCarById);

module.exports = routes;
