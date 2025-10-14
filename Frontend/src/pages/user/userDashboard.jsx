import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from '../../components/user/Navigation';
import Footer from '../../components/user/Footer';
import BookingForm from '../../components/user/BookingForm';
import BookingList from '../../components/user/BookingList';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    // read user from localStorage
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.name || u.username || 'User');
      }
    } catch {
      // ignore
    }

    // fetch bookings count for stats
    axios.get('http://localhost:30000/api/bookings', { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) setBookingsCount(res.data.length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    // clear local storage and navigate to login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/userLogin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
            <p className="text-sm text-gray-500">Manage your bookings and find the perfect car.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
            <button onClick={() => navigate('/BookingForm')} className="px-4 py-2 bg-blue-600 text-white rounded-md">New Booking</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Your bookings</h3>
            <p className="mt-2 text-2xl font-semibold">{bookingsCount}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Active cars</h3>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Support</h3>
            <p className="mt-2 text-2xl font-semibold">Contact us</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Quick Booking</h2>
              <BookingForm />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Your Bookings</h2>
              <BookingList />
            </div>
          </div>
        </section>
      </main>

      <Navigation />
      <Footer />
      
    </div>
  );
}

export default UserDashboard;