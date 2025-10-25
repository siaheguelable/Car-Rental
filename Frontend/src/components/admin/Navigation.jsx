import React from "react";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/adminLogin";
  };

  const handleAddBooking = () => {
    console.log("Add Booking clicked");
    navigate('/BookingForm');
  };

  const handleViewBookings = () => {
    console.log("View Bookings clicked");
    navigate('/booking-list');
  };

  const handleManageCars = () => {
    console.log("Manage Cars clicked");
    navigate('/manage-cars');
  };

  const handleManageUsers = () => {
    console.log("Manage Users clicked");
    navigate('/manage-users');
  };

  return (
    <nav className="top-nav" role="navigation" aria-label="Admin navigation">
      <div className="nav-inner">
        <div className="nav-brand">
          <img className="nav-logo" src="/logo.png" alt="Car rental logo" />
          <span>Car Rental</span>
        </div>

        <ul className="nav-list" role="menubar">
          <li className="nav-item" role="none">
            <button role="menuitem" className="nav-button" onClick={handleAddBooking}>Add Booking</button>
          </li>
          <li className="nav-item" role="none">
            <button role="menuitem" className="nav-button" onClick={handleViewBookings}>View Bookings</button>
          </li>
          <li className="nav-item" role="none">
            <button role="menuitem" className="nav-button" onClick={handleManageCars}>Manage Cars</button>
          </li>
          <li className="nav-item" role="none">
            <button role="menuitem" className="nav-button" onClick={handleManageUsers}>Manage Users</button>
          </li>
          <li className="nav-item" role="none">
            <button role="menuitem" className="nav-button nav-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;