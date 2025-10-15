import React, { useState } from "react";
import axios from "axios";

function BookingForm() {
    
    const [formData, setFormData] = useState({
        user: "userId", // Replace with actual user ID
        car: "carId", // Replace with actual car ID
        startDate: "",
        endDate: "",
        totalPrice: "",
        pickupLocation: "",
        dropoffLocation: "",
    });

const handleSubmit = (event) => {
  event.preventDefault();
  setFormData({
    ...formData,
    startDate: event.target.startDate.value,
    endDate: event.target.endDate.value,
    totalPrice: event.target.totalPrice.value,
    pickupLocation: event.target.pickupLocation.value,
    dropoffLocation: event.target.dropoffLocation.value,
  });

  axios.post("https://car-rental-si5p.onrender.com/api/bookings", {
      user: formData.user,
      car: formData.car,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice: formData.totalPrice,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
    })
    .then((response) => {
      console.log("Booking successful:", response.data);
    })
    .catch((error) => {
      console.error("Error booking car:", error);
    });
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Car</h2>
      <label>
        Pick-up Location:
        <input type="text" name="pickupLocation" required />
      </label>
      <label>
        Drop-off Location:
        <input type="text" name="dropoffLocation" required />
      </label>
      <label>
        Start Date:
        <input type="date" name="startDate" required />
      </label>
      <label>
        End Date:
        <input type="date" name="endDate" required />
      </label>
      <label>
        Price:
        <input type="number" name="totalPrice" required />
      </label>
      <button  type="submit">Book Now</button>
    </form>
  );
}

export default BookingForm;