import React, { useEffect, useState } from "react";
import axios from "axios";
const getApiUrl = () => import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || import.meta.env.BACKEND_URL || window.location.origin;

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
  const apiUrl = getApiUrl();
  const res = await axios.get(`${apiUrl.replace(/\/$/, "")}/api/cars`);
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

  const apiUrl = getApiUrl();
  await axios.post(`${apiUrl.replace(/\/$/, "")}/api/bookings`, bookingData, { withCredentials: true });
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
    <div className="w-full">
      <div className="bg-white p-6 rounded-lg shadow-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Book a Car</h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Car */}
          <div>
            <label className="block text-gray-700 mb-1">Select Car</label>
            <select
              name="car"
              value={formData.car}
              onChange={(e) => {
                const selected = cars.find((c) => c._id === e.target.value);
                setSelectedCar(selected);
                handleChange(e);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Choose a car --</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.make} {car.model} — ${car.pricePerDay}/day
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="e.g., Abidjan"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Drop-off Location</label>
              <input
                type="text"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                placeholder="e.g., Yamoussoukro"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600">Estimated total</div>
            <div className="text-lg font-semibold text-green-700">${totalPrice || 0}</div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
