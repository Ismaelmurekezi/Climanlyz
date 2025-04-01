import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Update the path as needed

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/"); // Redirect to home or dashboard
      } else {
        setError(result.error || "Failed to login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-Lato bg-darkBlue flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="text-2xl text-white absolute top-4 left-7">
        <span className="text-4xl font-medium text-primaryColor">C</span>
        limanlyz
      </Link>
      <h1 className="text-3xl text-cyan-400 mb-12">Welcome to Climanlyz</h1>
      {/* Login Form */}
      <div className="bg-blueDark p-8 rounded-lg w-full max-w-md">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-white rounded-md bg-transparent text-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-white rounded-md bg-transparent text-white"
            required
          />

          <button
            type="submit"
            className="w-full p-2 bg-lemonColor hover:bg-olive-600 text-white font-medium rounded transition duration-300"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-4 text-left text-white">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
