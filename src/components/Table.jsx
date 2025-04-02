import React, { useState, useEffect } from "react";
import "../css/Table.css";

export default function Table({ selectedTable = "customers", setSelectedTable = () => { }, setQuery, fullscreen }) {
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]); // Store full data
    const chunkSize = 100; 
    const [displayCount, setDisplayCount] = useState(chunkSize); 
    
    const tableOptions = [
        "categories",
        "customers",
        "employee_territories",
        "employees",
        "products",
        "fraud_data"
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (selectedTable) {
                try {
                    const response = await fetch(`/json/${selectedTable}.json`);
                    const jsonData = await response.json();
                    setAllData(jsonData); 
                    setData(jsonData.slice(0, displayCount)); 
                } catch (error) {
                    console.error("Error loading data:", error);
                    setAllData([]);
                    setData([]);
                }
            }
        };

        fetchData();
    }, [selectedTable]);


    const loadMore = () => {
        const newDisplayCount = displayCount + chunkSize;
        setData(allData.slice(0, newDisplayCount)); 
        setDisplayCount(newDisplayCount);
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (!data.length) return;

        const headers = Object.keys(data[0]);

        if (rowIndex === 0) {
       
            const columnName = colIndex === 0 ? "Row Number" : headers[colIndex - 1];
            const query = `SELECT ${columnName}\nFROM ${selectedTable}`;
            setQuery(query);
        } else {
            
             const fieldName = headers[colIndex-1];
             const query = `SELECT ${fieldName}\nFROM ${selectedTable}\nWHERE row = "${rowIndex}";`;
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
                    onChange={(e) => {
                        setSelectedTable(e.target.value);
                        setDisplayCount(chunkSize); 
                    }}
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
                    <>
                        <table>
                            <thead>
                                <tr>
                                <th>#</th>
                                    {Object.keys(data[0]).map((key, colIndex) => (
                                        <th
                                            key={colIndex}
                                            onClick={() => handleCellClick(0, colIndex+1)}
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
                                        <td>{rowIndex + 1}</td>
                                        {Object.values(row).map((value, colIndex) => (
                                            <td
                                                key={colIndex}
                                                onClick={() => handleCellClick(rowIndex + 1, colIndex+1)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {value !== null ? value : "N/A"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

               
                        {displayCount < allData.length && (
                            <button
                                onClick={loadMore}
                                className="load-more-btn"
                                style={{
                                    top: fullscreen ? "13px" : "13px",
                                    right: fullscreen ? "60px" : "60px",
                                }}
                            >
                                Load More
                            </button>

                        )}
                    </>
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </div>
    );
}