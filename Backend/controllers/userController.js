const userModel = require("../models/userModel");
const { validateUser } = require("../validators/userValidator");

// get all users (API)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Create a new user  (API)
exports.createUser = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    const errors = validateUser(newUser);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// update user by ID
exports.updateUserById = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const errors = validateUser(user);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// User login
exports.userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
