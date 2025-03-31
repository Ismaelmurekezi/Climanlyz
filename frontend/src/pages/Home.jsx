import React, { useState } from "react";
import { Link } from "react-router-dom";
import WeatherDataTable from "../components/table";


function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="w-full min-h-screen bg-darkBlue text-white font-Lato">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4">
        <Link to="/" className="text-2xl text-white">
          <span className="text-4xl font-medium  text-primaryColor">C</span>
          limanlyz
        </Link>
        <div className="flex gap-24 text-xl  pr-52">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <a href="#upload-file" className="text-cyan-400 hover:text-cyan-300">
            Analyze weather
          </a>
          <a href="#output" className="text-cyan-400 hover:text-cyan-300">
            Result
          </a>
        </div>
      </nav>

      <main className="w-full py-10">
        <section className="flex flex-col md:flex-row justify-between mb-7 px-24">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6">
              Climanlyz?
            </h1>
            <p className="text-lg leading-relaxed">
              Climate Data Analyzer is a platform that simplifies the collection
              and analysis of climate data by farmers and researchers. It uses
              Apache Spark to efficiently process data across multiple nodes,
              providing timely insights and trends that can impact farming
              practices. It offers visually Homeealing graphs and charts.
            </p>
          </div>

          {/* Weather Forecast Card */}
          <div className="">
            <img
              src="Weather1.png"
              alt="weather-image"
              className="rounded-2xl h-96"
            />
          </div>
        </section>

        {/* File Upload Section */}
        <section className="w-full px-28 py-16 mb-20 bg-black" id="upload-file">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            ANALYZE LARGE WEATHER DATASET
          </h2>
          <p className="mb-6">Pick any csv file to be processed</p>

          <div className="flex flex-col sm:flex-row gap-52">
            <label className="bg-white text-black px-6 py-2 rounded cursor-pointer inline-block">
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
        </section>

    
        <section className="px-28" id="output">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            FINAL OUTPUT
          </h2>
          <p className="max-w-2xl pb-7">
            Embrace the future of big data with Climate Data Analyzer and start
            optimizing your practices through data-driven insights today.
          </p>
        <WeatherDataTable/>
        </section>
      </main>
    </div>
  );
}

export default Home;
