const adminModel = require("../models/adminModel");

// Get all bookings (Admin)
exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = new adminModel(req.body);
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};
