function validateUser(user) {
  const errors = [];
  if (!user.name || user.name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
    errors.push("Email is invalid.");
  }
  if (user.password && user.password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }
  return errors;
}
module.exports = { validateUser };
