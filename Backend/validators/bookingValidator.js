function validateBooking(booking) {
  const errors = [];
  if (!booking.user) {
    errors.push("User ID is required.");
  }
  if (!booking.car) {
    errors.push("Car ID is required.");
  }
  if (!booking.startDate || !booking.endDate) {
    errors.push("Start date and end date are required.");
  }
  if (new Date(booking.startDate) >= new Date(booking.endDate)) {
    errors.push("End date must be after start date.");
  }
  return errors;
}
// Export with two names for backward compatibility
module.exports = { validateBooking, bookingValidate: validateBooking };
