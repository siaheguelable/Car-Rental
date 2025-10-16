import React from "react";

function AdminLogin() {
  const handleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.BACKEND_URL || "http://localhost:30000" || window.location.origin;
    window.location.href = `${apiUrl.replace(/\/$/, "")}/auth/github`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center">
        <h2 className="text-2xl font-semibold mb-6">Admin Login</h2>

        <button
          onClick={handleLogin}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
