const routes = require("express").Router();
const bookingsController = require("../controllers/bookingController");
// Define routes for bookings

routes.post("/bookings", bookingsController.createBooking);
// Get all bookings
routes.get("/bookings", bookingsController.getAllBookings);
// Get, update, delete a booking by ID
routes.get("/bookings/:id", bookingsController.getBookingById);
// Update and delete routes
routes.put("/bookings/:id", bookingsController.updateBooking);
// Delete a booking by ID
routes.delete("/bookings/:id", bookingsController.deleteBooking);

module.exports = routes;
