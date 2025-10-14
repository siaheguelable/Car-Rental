function validateAdmin(admin) {
  const errors = [];
  if (!admin.name || admin.name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (!admin.email || !/\S+@\S+\.\S+/.test(admin.email)) {
    errors.push("Valid email is required.");
  }
  if (!admin.password || admin.password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }
  return errors;
}
module.exports = { validateAdmin };
