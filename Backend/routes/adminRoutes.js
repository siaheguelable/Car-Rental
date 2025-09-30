const routes = require("express").Router();
const adminController = require("../controllers/adminController");

// Admin routes
routes.get("/admin/bookings", adminController.getAllBookings);
routes.get("/admin/bookings/:id", adminController.getBookingById);
routes.put("/admin/bookings/:id", adminController.updateBooking);
routes.delete("/admin/bookings/:id", adminController.deleteBooking);

module.exports = routes;
