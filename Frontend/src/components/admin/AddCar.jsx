import React from "react";

import axios from "axios";
import { useState } from "react";
function AddCar() {

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    brand: "",
    year: "",
    pricePerDay: "",
    available: true,
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const carData = {
    name: formData.name,
    brand: formData.brand,
    model: formData.model,
    year: Number(formData.year),
    pricePerDay: Number(formData.pricePerDay),
    available: formData.available,
    image: formData.image,
  };

    try {
        console.log("Form data being sent:", carData);

      await axios.post("https://car-rental-2-8y9s.onrender.com/api/cars", carData);
        console.log("Car added successfully");
      // Redirect or show success message
    } catch (error) {
      console.error("Error adding car:", error);
      // Show error message
    }
  };

  return (
    <div>
      <h1>Add Car</h1>
        <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <input
          type="number"
          name="pricePerDay"
          placeholder="Price Per Day"
          value={formData.pricePerDay}
          onChange={handleChange}
        />
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              available: e.target.checked,
            }))
          }
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}
export default AddCar;
