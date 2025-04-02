import React from "react";
import "../css/SQLResult.css";

const SQLResult = ({ result, error,height }) => {
  const renderTable = () => {
    if(!error && !result)
        return <div className="sql-placeholder" > Run a Query to see the result</div>
    if (!Array.isArray(result) || result.length === 0) {
      return <div className="sql-placeholder">No result found.</div>;
    }

    // 1st row of the table
    const headers = Object.keys(result[0]);  

    return (
      <table className="sql-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="sql-result-container" style={{height}}>
      <div className="sql-result-header">
        <span>Query Result</span>
      </div>

      <div className="sql-output">
        {error ? (
          <div className="sql-error">
            <span>❌ Error: {error}</span>
          </div>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
};

export default SQLResult;
