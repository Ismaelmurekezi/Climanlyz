import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WeatherDataTable from "../components/table";
import { useAuth } from "../context/AuthContext"; // Update path as needed

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="w-full min-h-screen bg-darkBlue text-white font-Lato">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 relative">
        <Link to="/" className="text-2xl text-white z-20">
          <span className="text-4xl font-medium text-primaryColor">C</span>
          limanlyz
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden z-20 text-white"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <a href="#upload-file" className="text-cyan-400 hover:text-cyan-300">
            Analyze weather
          </a>
          <a href="#output" className="text-cyan-400 hover:text-cyan-300">
            Result
          </a>

          {/* Authentication Links */}
          {currentUser ? (
            <div className="flex gap-4 items-center">
              <span className="text-white">
                Welcome, {currentUser.username || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-darkBlue bg-opacity-95 z-10 flex flex-col items-center justify-center space-y-6 md:hidden">
            <Link
              to="/"
              className="text-cyan-400 hover:text-cyan-300 text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#upload-file"
              className="text-cyan-400 hover:text-cyan-300 text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analyze weather
            </a>
            <a
              href="#output"
              className="text-cyan-400 hover:text-cyan-300 text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Result
            </a>

            {currentUser ? (
              <>
                <span className="text-white text-xl">
                  Welcome, {currentUser.username || currentUser.email}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="w-full py-6 md:py-10">
        <section className="flex flex-col md:flex-row justify-between mb-7 px-4 md:px-24 gap-8">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4 md:mb-6">
              Climanlyz?
            </h1>
            <p className="text-base md:text-lg leading-relaxed">
              Climate Data Analyzer is a platform that simplifies the collection
              and analysis of climate data by farmers and researchers. It uses
              Apache Spark to efficiently process data across multiple nodes,
              providing timely insights and trends that can impact farming
              practices. It offers visually appealing graphs and charts.
            </p>

            {/* Call-to-action buttons for non-authenticated users */}
            {!currentUser && (
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded transition duration-300 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-lemonColor hover:bg-opacity-90 text-white px-6 py-3 rounded transition duration-300 text-center"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Weather Forecast Card */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src="Weather1.png"
              alt="weather-image"
              className="rounded-2xl h-64 md:h-80 lg:h-96 object-cover"
            />
          </div>
        </section>

        {/* File Upload Section */}
        <section
          className="w-full px-4 md:px-28 py-10 md:py-16 mb-10 md:mb-20 bg-black"
          id="upload-file"
        >
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4 md:mb-6">
            ANALYZE LARGE WEATHER DATASET
          </h2>
          <p className="mb-6">Pick any csv file to be processed</p>

          {!currentUser ? (
            <div className="bg-darkBlue p-4 md:p-6 rounded-lg">
              <p className="mb-4">
                You need to be logged in to upload and analyze files
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-lemonColor hover:bg-opacity-90 text-white px-6 py-2 rounded text-center"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-52">
              <label className="bg-white text-black px-6 py-2 rounded cursor-pointer inline-block text-center">
                Choose file
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded"
                disabled={!selectedFile}
              >
                Upload file
              </button>
            </div>
          )}
        </section>

        <section className="px-4 md:px-28" id="output">
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4 md:mb-6">
            FINAL OUTPUT
          </h2>
          <p className="max-w-2xl pb-7">
            Embrace the future of big data with Climate Data Analyzer and start
            optimizing your practices through data-driven insights today.
          </p>

          <div className="overflow-x-auto">
            {!currentUser ? (
              <div className="bg-darkBlue p-4 md:p-6 rounded-lg">
                <p>Login to view analysis results</p>
              </div>
            ) : (
              <WeatherDataTable />
            )}
          </div>
        </section>
      </main>

      {/* Footer with authentication links */}
      <footer className="bg-black text-white p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-2xl text-white">
                <span className="text-3xl font-medium text-primaryColor">
                  C
                </span>
                limanlyz
              </Link>
              <p className="mt-2">Weather data analysis made simple</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/" className="text-cyan-400 hover:text-cyan-300">
                Home
              </Link>

              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p>
              &copy; {new Date().getFullYear()} Climanlyz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
