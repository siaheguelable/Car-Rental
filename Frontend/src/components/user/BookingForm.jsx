import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/editbooking.css";

const BookingForm = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    car: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userRaw = localStorage.getItem("user");
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  // Fetch available cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        
        const res = await axios.get("http://localhost:30000/api/cars", { withCredentials: true });
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };
    fetchCars();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate total price automatically
  useEffect(() => {
    if (formData.startDate && formData.endDate && selectedCar) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setTotalPrice(diffDays * selectedCar.pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [formData.startDate, formData.endDate, selectedCar]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!user || !user._id) {
      setMessage("❌ You must be logged in to make a booking.");
      setLoading(false);
      return;
    }

    // Client-side date validation
    if (!formData.startDate || !formData.endDate) {
      setMessage("❌ Start date and end date are required.");
      setLoading(false);
      return;
    }
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start >= end) {
      setMessage("❌ End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      console.log("Booking data:", {
        user: user._id,
        car: formData.car,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
      });

      const bookingData = {
        user: user._id,
        car: formData.car,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
      };

      await axios.post(`http://localhost:30000/api/bookings`, bookingData, { withCredentials: true });
  
      setMessage("✅ Booking created successfully!");
      setFormData({
        car: "",
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropoffLocation: "",
      });
      setTotalPrice(0);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.errors) {
        setMessage("❌ " + (err.response.data.errors.join("; ") || "Validation error"));
      } else if (err.response && err.response.data && err.response.data.message) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("❌ Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div>
        <h2 style={{ margin: 0, marginBottom: '0.75rem' }}>Book a Car</h2>

        {message && (
          <div className={`message ${message.startsWith("✅") ? "success" : "error"}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Select Car */}
          <div>
            <label className="form-label">Select Car</label>
            <select
              name="car"
              value={formData.car}
              onChange={(e) => {
                const selected = cars.find((c) => c._id === e.target.value);
                setSelectedCar(selected);
                handleChange(e);
              }}
              className="form-input"
              required
            >
              <option value="">-- Choose a car --</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.make || car.name} {car.model || car.brand} — ${car.pricePerDay}/day
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid cols-2">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid cols-2">
            <div>
              <label className="form-label">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="e.g., Abidjan"
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Drop-off Location</label>
              <input
                type="text"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                placeholder="e.g., Yamoussoukro"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Total Price */}
          <div className="price-row">
            <div className="muted">Estimated total</div>
            <div className="amount">${totalPrice || 0}</div>
          </div>

          {/* Submit Button */}
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
