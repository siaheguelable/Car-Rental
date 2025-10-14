const adminModel = require("../models/adminModel");
const { adminValidate } = require("../validators/adminValidator");
// Get all bookings (Admin)
exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = new adminModel(req.body);
    const errors = adminValidate(newAdmin);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};

// Get all users (Admin)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
};
// Get a user by ID (Admin)
exports.getAdminById = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin", error });
  }
};
// Update a user by ID (Admin)
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const errors = adminValidate(updatedAdmin);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error });
  }
};

// Delete a user by ID (Admin)
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await adminModel.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
};
