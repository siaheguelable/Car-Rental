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
    <div>
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
            {/* ✅ Safe rendering */}
            {Array.isArray(cars) &&
              cars.map((car) => (
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
          <div className="text-lg font-semibold text-green-700">
            ${totalPrice || 0}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Booking"}
        </button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
    </div>
  );
};

export default EditBooking;
