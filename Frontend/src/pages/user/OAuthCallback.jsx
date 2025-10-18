import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      
      window.location.origin;

    axios
      .get(`${apiUrl.replace(/\/$/, "")}/api/user`, { withCredentials: true })
      .then((res) => {
        // The /api/user endpoint returns the session user directly (req.user) in the server code.
        // Normalize shapes: prefer res.data.user if present, otherwise use res.data
        const user = res.data?.user ?? res.data;
        if (!user) {
          // No session user found; go to login
          return navigate("/userLogin");
        }

        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/userDashboard");
        }
      })
      .catch((err) => {
        console.error("OAuth user fetch failed:", err);
        navigate("/userLogin");
      });
  }, [navigate]);

  return <div>Logging in with GitHub...</div>;
}

export default OAuthCallback;