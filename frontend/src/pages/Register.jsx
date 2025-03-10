import React, { useState } from "react";
import { Link } from "react-router-dom";


function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen font-Lato bg-darkBlue flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="text-2xl  text-white absolute top-4 left-7 mb-12">
        <span className="text-4xl text-primaryColor ">C</span>limanlyz
      </Link>
      <h1 className="text-3xl text-cyan-400 mb-12">Welcome to Climanlyz</h1>
      {/* Registration Form */}
      <div className="bg-blueDark p-8 rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-white rounded-md bg-transparent text-white"
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-white rounded-md bg-transparent text-white"
            required
          />

          <button
            type="submit"
            className="w-full p-2 bg-lemonColor hover:bg-olive-600 text-white font-medium rounded transition duration-300"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className="mt-4 text-left text-white">
          You got an account{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
              </div>
      </div>
          
    </div>
  );
}

export default Register;
