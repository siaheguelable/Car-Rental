const routes = require("express").Router();
const adminController = require("../controllers/adminController");

routes.use((req, res, next) => {
  console.log("Admin route accessed");
  next();
});

// Admin routes

routes.post("/admin", adminController.createAdmin);
routes.get("/admin", adminController.getAllAdmins);
routes.get("/admin/:id", adminController.getAdminById);
routes.put("/admin/:id", adminController.updateAdmin);
routes.delete("/admin/:id", adminController.deleteAdmin);

module.exports = routes;
