import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://car-rental-si5p.onrender.com/api/user", { withCredentials: true })
      .then((res) => {
        // The login endpoint (`/api/users/login`) stores the user as res.data.user.
        // The /api/user endpoint returns the session user directly (req.user) in the server code.
        // Normalize both shapes: prefer res.data.user if present, otherwise use res.data
        const user = res.data?.user ?? res.data;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/userDashboard");
      })
      .catch((err) => {
        console.error("OAuth user fetch failed:", err);
      });
  }, [navigate]);

  return <div>Logging in with GitHub...</div>;
}

export default OAuthCallback;