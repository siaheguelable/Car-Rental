const bookingModel = require("../models/bookingModel.js");
const { validateBooking } = require("../validators/bookingValidator.js");
// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    // Prefer authenticated session user when available
    const userId = (req.user && req.user._id) || (req.body && req.body.user);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: you must be logged in to create a booking.",
      });
    }

    // Build booking payload server-side to avoid trusting client-provided user id
    const payload = {
      user: userId,
      car: req.body.car,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalPrice: req.body.totalPrice,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
    };

    const newBooking = new bookingModel(payload);
    const errors = validateBooking(newBooking);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};
// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || (req.body && req.body.user);
    const bookings = await bookingModel.find({ user: userId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};
// Update a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const errors = validateBooking(updatedBooking);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};
// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await bookingModel.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};
