import React from 'react';
import BookingForm from './BookingForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditBooking from './EditBooking';

function BookingList() {
  const [bookings, setBookings] = React.useState([]);
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`https://car-rental-2-8y9s.onrender.com/api/bookings/${id}`, { withCredentials: true });
      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
    } catch (err) {
      console.error("Failed to delete booking", err);
      alert("Failed to delete booking. See console for details.");
    }
  };

  const getBookings = () => {
    // Fetch bookings from the API
    return axios.get('https://car-rental-2-8y9s.onrender.com/api/bookings', { withCredentials: true })
      .then(response => {
        // Handle the response data
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        // Handle any errors
        console.error('There was an error fetching the bookings!', error);
        return [];
      });
  };
  const handleUpdateBooking = () => {
    navigate("/EditBooking");
  }



  React.useEffect(() => {
    const fetchBookings = async () => {
      const fetchedBookings = await getBookings();
      setBookings(fetchedBookings);
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Booking List</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id || booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div>
              <strong>{booking.car ? (booking.car.make ? `${booking.car.make} ${booking.car.model}` : booking.car) : 'Car'}</strong>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                {booking.user ? (booking.user.name || booking.user) : 'Unknown user'} — {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleUpdateBooking(booking._id || booking.id)}
                style={{ padding: '6px 10px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteHandler(booking._id || booking.id)}
                style={{ padding: '6px 10px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      
    </div>
    
  );
}

export default BookingList;