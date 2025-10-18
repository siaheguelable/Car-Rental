import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // When backend redirects to the frontend root with ?oauth=github, complete the flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("oauth") === "github") {
      // try to fetch current session user
      const apiUrl = getApiUrl();
      axios
        .get(`${apiUrl.replace(/\/$/, "")}/api/user`, { withCredentials: true })
        .then((res) => {
          const user = res.data?.user ?? res.data;
          if (!user) {
            // nothing to do, remain on login
            return;
          }
          localStorage.setItem("user", JSON.stringify(user));
          // navigate based on role
          if (user.role === "admin") {
            navigate("/adminDashboard");
          } else {
            navigate("/userDashboard");
          }
        })
        .catch((err) => {
          console.error("OAuth session fetch failed:", err);
        })
        .finally(() => {
          // remove oauth param from URL to keep things clean
          params.delete("oauth");
          const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
          window.history.replaceState({}, document.title, newUrl);
        });
    }
  }, [navigate]);

  // Determine backend API base URL using several possible env var names
  const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, ""); // remove trailing slash if any

  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost")
  ) {
    return "http://localhost:30000";
  }

  return "https://car-rental-si5p.onrender.com";
};

  // Handle GitHub login
  const handleGitLogin = () => {
    const apiUrl = getApiUrl();
    window.location.href = `${apiUrl.replace(/\/$/, "")}/auth/github`;
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  const apiUrl = getApiUrl();
  const res = await axios.post(`${apiUrl.replace(/\/$/, "")}/api/users/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/userDashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGitLogin}
          className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Login with GitHub
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
