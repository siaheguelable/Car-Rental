const routes = require("express").Router();
const adminController = require("../controllers/adminController");

routes.use((req, res, next) => {
  console.log("Admin route accessed");
  next();
});

// Admin routes
routes.post("/admin/bookings", adminController.createAdmin);

module.exports = routes;
