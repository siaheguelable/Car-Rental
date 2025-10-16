import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const getApiUrl = () => import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || import.meta.env.BACKEND_URL || window.location.origin;

function CarsList() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  // Function to fetch cars from API
  const getCars = async () => {
    try {
  const apiUrl = getApiUrl();
  const response = await axios.get(`${apiUrl.replace(/\/$/, "")}/api/cars`, {
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
