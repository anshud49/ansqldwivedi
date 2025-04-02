import React, { useState, useEffect } from "react";
import "../css/Table.css";

export default function Table({ selectedTable = "customers", setSelectedTable = () => {}, setQuery }) {
  const [data, setData] = useState([]);
  const tableOptions = [
    "categories",
    "customers",
    "employee_territories",
    "employees",
    "products",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTable) {
        try {
          const response = await fetch(`/json/${selectedTable}.json`);
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error("Error loading data:", error);
          setData([]);
        }
      }
    };

    fetchData();
  }, [selectedTable]);

 
  const handleCellClick = (rowIndex, colIndex) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    
    if (rowIndex === 0) {
      //  Case (a): if 1st row is clicked
      const columnName = headers[colIndex];
      const query = `SELECT ${columnName}\nFROM ${selectedTable}`;
      setQuery(query);
    } else {
      // ✅ Case (b): if any other cell is clicked
      const fieldName = headers[colIndex];              
      const fieldValue = data[rowIndex - 1][headers[0]];  
      const query = `SELECT ${fieldName}\nFROM ${selectedTable}\nWHERE ${headers[0]} = "${fieldValue}";`;
      setQuery(query);
    }
  };

  return (
    <div className="table-container">
      <div className="header">
        <label htmlFor="table-select">Select Table:</label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tableOptions.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        {data.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key, colIndex) => (
                  <th 
                    key={colIndex} 
                    onClick={() => handleCellClick(0, colIndex)} 
                    style={{ cursor: "pointer" }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      onClick={() => handleCellClick(rowIndex + 1, colIndex)}  
                      style={{ cursor: "pointer" }}
                    >
                      {value !== null ? value : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}
