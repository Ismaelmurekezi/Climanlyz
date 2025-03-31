import React from "react";

function WeatherDataTable({ data }) {
  // Sample data if none is provided
  const sampleData = [
    {
      id: 1,
      region: "Northern",
      avgTemp: 22.4,
      maxTemp: 31.7,
      rainfall: 127.8,
    },
    { id: 2, region: "Central", avgTemp: 24.1, maxTemp: 33.5, rainfall: 89.3 },
    {
      id: 3,
      region: "Southern",
      avgTemp: 20.8,
      maxTemp: 29.2,
      rainfall: 156.2,
    },
    { id: 4, region: "Coastal", avgTemp: 25.3, maxTemp: 32.8, rainfall: 203.5 },
    { id: 5, region: "Eastern", avgTemp: 23.9, maxTemp: 34.1, rainfall: 112.7 },
  ];

  // Use provided data or sample data
  const tableData = data || sampleData;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-[50%] border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-200 p-4 text-left text-cyan-400 font-medium">
              Region
            </th>
            <th className="border border-gray-200 p-4 text-left text-cyan-400 font-medium">
              Average temperature (°C)
            </th>
            {/* <th className="border border-gray-200 p-4 text-left text-cyan-400 font-medium">
              Max temperature (°C)
            </th> */}
            <th className="border border-gray-200 p-4 text-left text-cyan-400 font-medium">
              Total rainfall (mm)
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} className="hover:bg-blue-900/30">
              <td className="border border-gray-200 p-4 text-white">
                {row.region}
              </td>
              <td className="border border-gray-200 p-4 text-white">
                {row.avgTemp}
              </td>
              {/* <td className="border border-gray-200 p-4 text-white">
                {row.maxTemp}
              </td> */}
              <td className="border border-gray-200 p-4 text-white">
                {row.rainfall}
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}

export default WeatherDataTable;
