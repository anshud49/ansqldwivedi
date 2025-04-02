import React, { useState, useEffect } from "react";
import "../css/SQLResult.css";

const CHUNK_SIZE = 50; //adjustable

const SQLResult = ({ result, error, height,fullscreen }) => {
  const [displayedRows, setDisplayedRows] = useState([]);
  const [loadedChunks, setLoadedChunks] = useState(1);
  const [visibleRows, setVisibleRows] = useState(CHUNK_SIZE);

  useEffect(() => {
    setVisibleRows(CHUNK_SIZE); 
  }, [result]);

  useEffect(() => {
    if (Array.isArray(result) && result.length > 0) {
      setDisplayedRows(result.slice(0, CHUNK_SIZE));
      setLoadedChunks(1);
    }
  }, [result]);

  const loadMore = () => {
    setVisibleRows((prev) => prev + CHUNK_SIZE);
  };

  const renderTable = () => {
    if (!error && !result) {
      return <div className="sql-placeholder">Run a Query to see the result</div>;
    }
    if (!Array.isArray(result) || result.length === 0) {
      return <div className="sql-placeholder">No result found.</div>;
    }

    const headers = ["#", ...Object.keys(result[0])];
    return (
      <>
        <table className="sql-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.slice(0, visibleRows).map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td> 
                {Object.keys(row).map((header, colIndex) => (
                  <td key={colIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {visibleRows < result.length && (
          <button className="load-more-result" onClick={loadMore}
          style={{
            position: "absolute",
            top: fullscreen ? "0px":"8.8px",
            right: fullscreen ? "100px" : "75px",
          }}>
            Load More
          </button>
        )}
      </>
    );
  };

  return (
    <div className="sql-result-container" style={{ height }}>
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