import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import Navigation from "../../components/user/Navigation";
import Footer from "../../components/user/Footer";
import BookingForm from "../../components/user/BookingForm";
import BookingList from "../../components/user/BookingList";

function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    // ✅ Read user from localStorage
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        setUserName(parsedUser.name || parsedUser.username || "User");
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }

    // ✅ Fetch bookings count for statistics
    axios
      .get("http://localhost:30000/api/bookings", { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBookingsCount(res.data.length);
        }
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
      });
  }, []);

  const handleLogout = () => {
    // ✅ Clear localStorage and navigate to login
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/userLogin");
  };

  return (
    
    <div className="user-dashboard">
      {/* ===== Header Section ===== */}
      <header className="dashboard-header">
        <div className="inner">
          <div>
            <h1 className="welcome-badge">Welcome back, {userName}</h1>
            
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Active cars</h3>
              
            </div>
          </div>

          <div className="dashboard-actions">
            <h3 ><a href="">Support</a></h3>
            <h3><a href="">Contact us</a></h3>

            <button onClick={handleLogout} className="btn-danger">Logout</button>
            <button onClick={() => navigate("/BookingForm")} className="btn-primary-light">New Booking</button>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="muted-text">Manage your bookings and find the perfect car.</p>
        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Your bookings</h3>
            <p className="mt-2 text-2xl font-semibold">{bookingsCount}</p>
          </div>

          

          
        </section>

        {/* Booking Section */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Quick Booking</h2>
              <BookingForm />
            </div>
          </div>

          {/* Booking List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Your Bookings</h2>
              <BookingList />
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer and Navigation ===== */}
      <Navigation />
      <Footer />
    </div>
  );
}

export default UserDashboard;
