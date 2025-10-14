
import { useNavigate } from "react-router-dom";

// import React, { useState } from "react";
function ManageCars() {
  const navigate = useNavigate();

  const handleAddCar = () => {
    // Implement your add car logic here
    console.log("Add Car clicked");
    navigate("/add-car");
  };

  const handleViewCars = () => {
    // Implement your view cars logic here
    console.log("View Cars clicked");
    navigate("/car-list");
  };

  return (
    <div>
      <h1>Manage Cars</h1>
      <button onClick={handleAddCar}>Add Car</button>
      <button onClick={handleViewCars}>View Cars</button>
    </div>
  );
}

export default ManageCars;
