import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
import BookingForm from "./bookingForm.jsx";

function Nav() {
  // const  [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.removeItem("token");
    window.location.href = "/login";
  }


    const handleAddBooking = () => {
      // Implement your add booking logic here
      console.log("Add Booking clicked");
        navigate('/add-booking');
    }

    const handleViewBookings = () => {
      // Implement your view bookings logic here
      console.log("View Bookings clicked");
      navigate('/view-bookings');
    }

    const handleManageCars = () => {
      // Implement your manage cars logic here
      console.log("Manage Cars clicked");
      navigate('/manage-cars');
    }

    const handleManageUsers = () => {
      // Implement your manage users logic here
      console.log("Manage Users clicked");
      navigate('/manage-users');
    }

  return (

      <nav style={{ backgroundColor: '#3B82F6' }}>  

      <ul style={{ display: 'flex', listStyleType: 'none', padding: 20, marginLeft: 10, gap: 20, justifyContent: 'space-between', alignItems: 'center', fontSize: '20px' }}>
        <li>  Car Rental</li>
        <li> <img src="path/to/your/image.jpg" alt="Description" /></li>
        <li>  <button onClick={handleAddBooking}>Add Booking</button></li>
        <li> <button onClick={handleViewBookings}>View Bookings</button></li>
        <li> <button onClick={handleManageCars}>Manage Cars</button></li>
        <li> <button onClick={handleManageUsers}>Manage Users</button></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
      
    </nav>
   
  );

}
export default Nav;