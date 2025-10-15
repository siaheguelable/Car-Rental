import React from 'react';    
import AdminDashboard from './pages/admin/adminDashboard';
import AdminLogin  from './pages/admin/adminLogin';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/admin/register';  
import UserDashboard from './pages/user/UserDashboard'; 
import UserLogin from './pages/user/userLogin'; // lowercase
import BookingForm from './components/user/BookingForm'; // Add this import
import OAuthCallback from "./pages/user/OAuthCallback";
import EditBooking from './components/user/EditBooking'; // Add this import 
import BookingList from './components/user/BookingList'; // Add this import 
import ManageCars from './pages/admin/manage-cars'; // Add this import
import AddCar from './components/admin/AddCar'; // Add this import
import CarList from './components/admin/CarList'; // Add this import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/userLogin" />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userLogin" element={<UserLogin />} /> 
        <Route path="/BookingForm" element={<BookingForm />} /> {/* Add this route */}
        <Route path="/oauth-callback" element={<OAuthCallback />} /> {/* Add this route */}
        <Route path="/EditBooking" element={<EditBooking />} /> {/* Add this route */}
        <Route path="/booking-list" element={<BookingList />} /> {/* Add this route */}
        <Route path="/manage-cars" element={<ManageCars />} /> {/* Add this route */}
        <Route path="/add-car" element={<AddCar />} /> {/* Add this route */}
        <Route path="/car-list" element={<CarList />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
