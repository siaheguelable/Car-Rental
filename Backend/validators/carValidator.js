function validateCar(car) {
  const errors = [];
  if (!car.name || car.name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (!car.model || car.model.length < 2) {
    errors.push("Model must be at least 2 characters long.");
  }
  if (
    !car.year ||
    isNaN(car.year) ||
    car.year < 1886 ||
    car.year > new Date().getFullYear()
  ) {
    errors.push("Year must be a valid year.");
  }
  if (!car.pricePerDay || isNaN(car.pricePerDay) || car.pricePerDay < 0) {
    errors.push("Price must be a positive number.");
  }
  return errors;
}
module.exports = { validateCar };
