import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CarsList() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  // Function to fetch cars from API
  const getCars = async () => {
    try {
      const response = await axios.get("https://car-rental-2-8y9s.onrender.com/api/cars", {
        withCredentials: true,
      });
      console.log("Fetched cars:", response.data);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetch cars when component mounts
  useEffect(() => {
    getCars();
  }, []);

  return (
    <div>
      <h1>Cars List</h1>
      <button onClick={() => navigate("/add-car")}>Add Car</button>

      {/* Display cars */}
      <ul>
        {cars.length > 0 ? (
          cars.map((car) => (
            <li key={car._id}>
              <strong>{car.name}</strong> — {car.brand}, {car.model} (
              {car.year}) - ${car.pricePerDay}/day
            </li>
          ))
        ) : (
          <p>No cars found.</p>
        )}
      </ul>
    </div>
  );
}

export default CarsList;
