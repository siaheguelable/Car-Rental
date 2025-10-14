const carModel = require("../models/carModel.js");
const { validateCar } = require("../validators/carValidator.js");
// Create a new car
exports.createCar = async (req, res) => {
  try {
    const newCar = new carModel(req.body);
    const errors = validateCar(newCar);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    await newCar.save();
    res.status(201).json({ message: "Car created successfully", car: newCar });
  } catch (error) {
    res.status(500).json({ message: "Failed to create car", error });
  }
};
// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await carModel.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cars", error });
  }
};
// Get a car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);
    const errors = validateCar(car);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve car", error });
  }
};
// Update a car by ID
exports.updateCarById = async (req, res) => {
  try {
    const car = await carModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const errors = validateCar(car);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Failed to update car", error });
  }
};
// Delete a car by ID
exports.deleteCarById = async (req, res) => {
  try {
    const car = await carModel.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete car", error });
  }
};
