import React, { useEffect, useState } from "react";
import axios from "axios";

const EditBooking = ({ bookingId, onClose, onUpdate }) => {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState(null);
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

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user", { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        console.log("Cars API response:", response.data);

        // ✅ Safely handle both array and object responses
        setCars(Array.isArray(response.data) ? response.data : response.data.cars || []);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setCars([]); // fallback to empty array if API fails
      }
    };
    fetchCars();
  }, []);

  // Calculate total price
  useEffect(() => {
    if (formData.startDate && formData.endDate && selectedCar) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalPrice(diffDays > 0 ? diffDays * selectedCar.pricePerDay : 0);
    }
  }, [formData.startDate, formData.endDate, selectedCar]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user || !user._id) {
      setMessage("❌ You must be logged in to make a booking.");
      setLoading(false);
      return;
    }

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

    const bookingData = {
      user: user._id,
      car: formData.car,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
    };

    try {
      await axios.post("/api/bookings", bookingData, { withCredentials: true });
      setMessage("✅ Booking updated successfully!");
      onUpdate(bookingData); // Notify parent component
      onClose(); // Close the modal
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid cols-2">
        {/* Select Car */}
        <div className="">
          <label className="form-label">Select Car</label>
          <select
            name="car"
            value={formData.car}
            onChange={(e) => {
              const selected = cars.find((c) => c._id === e.target.value);
              setSelectedCar(selected);
              handleChange(e);
            }}
            className="form-select"
            required
          >
            <option value="">-- Choose a car --</option>
            {Array.isArray(cars) &&
              cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.make} {car.model} — ${car.pricePerDay}/day
                </option>
              ))}
          </select>
        </div>

        <div className="">
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

        <div>
          <label className="form-label">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Any additional information..."
          />
        </div>

        {/* Price and actions full-width */}
        <div className="price-row" style={{ gridColumn: '1 / -1' }}>
          <div className="muted">Estimated total</div>
          <div className="text-lg font-semibold text-green-700">${totalPrice || 0}</div>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Updating...' : 'Update Booking'}
          </button>

          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </form>

      {message && (
        <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</div>
      )}
    </div>
  );
};

export default EditBooking;
