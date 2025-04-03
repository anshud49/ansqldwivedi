import React, { useState, useRef, useEffect } from "react";
import SQLQueryEditor from "./components/SQLQueryEditor";
import Table from "./components/Table";
import SQLResult from "./components/SQLResult";
import "./App.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState({});
  const [selectedTable, setSelectedTable] = useState("customers");  //by-default customer table is shown




  const [fullscreenSection, setFullscreenSection] = useState(
    localStorage.getItem("fullscreenSection") === "null" ? null : localStorage.getItem("fullscreenSection")
  );
  useEffect(() => {
    const loadData = async () => {
      try {
        const customers = await import("./json/customers.json");
        const categories = await import("./json/categories.json");
        const employeeTerritories = await import("./json/employee_territories.json");
        const employees = await import("./json/employees.json");
        const products = await import("./json/products.json");
        const fraudData = await import("./json/fraud_data.json");

        setTableData({
          customers: customers.default,
          categories: categories.default,
          employee_territories: employeeTerritories.default,
          employees: employees.default,
          products: products.default,
          fraud_data: fraudData.default,
        });
      } catch (error) {
        console.error("Error loading JSON files:", error);
      }
    };

    loadData();
  }, []);

  const parseQuery = (query) => {
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
    const tableMatch = query.match(/FROM\s+(\w+)/i);
    const conditionMatch = query.match(/WHERE\s+(.+)/i);

    const fields = selectMatch ? selectMatch[1].split(",").map(f => f.trim()) : ["*"];
    const tableName = tableMatch ? tableMatch[1] : null;
    const condition = conditionMatch ? conditionMatch[1] : null;

    return { fields, tableName, condition };
  };

  const filterData = (data, condition, fields) => {
    if (!condition) {
      return data.map((row) => {
        const normalizedRow = Object.fromEntries(
          Object.entries(row).map(([key, val]) => [key.toLowerCase(), val])
        );

        if (fields.includes("*")) return normalizedRow;

        const filteredRow = {};
        fields.forEach((f) => {
          const lowerF = f.toLowerCase();
          if (normalizedRow.hasOwnProperty(lowerF)) {
            filteredRow[f] = normalizedRow[lowerF];
          }
        });
        return filteredRow;
      });
    }


    const cleanCondition = condition.trim();
    const rowMatch = cleanCondition.match(/row\s*=\s*["']?(\d+)["']?/i);

    if (rowMatch) {
      const rowIndex = parseInt(rowMatch[1], 10) - 1; 
      if (rowIndex >= 0 && rowIndex < data.length) {
        const row = data[rowIndex];
        const normalizedRow = Object.fromEntries(
          Object.entries(row).map(([key, val]) => [key.toLowerCase(), val])
        );

        if (fields.includes("*")) return [normalizedRow];

        const filteredRow = {};
        fields.forEach((f) => {
          const lowerF = f.toLowerCase();
          if (normalizedRow.hasOwnProperty(lowerF)) {
            filteredRow[f] = normalizedRow[lowerF];
          }
        });
        return [filteredRow];
      } else {
        return ["Row not found"];
      }
    }

    const [field, operator, value] = condition
      .split(/(=|>|<|>=|<=|!=)/)
      .map((part) => part.trim());

    const formattedValue = value ? value.replace(/['";]/g, "").toLowerCase() : "";

    const filteredRows = data.filter((row) => {
      const lowerField = field.toLowerCase();
      const lowerRow = Object.fromEntries(
        Object.entries(row).map(([key, val]) => [key.toLowerCase(), val])
      );

      const rowValue = String(lowerRow[lowerField] || "").toLowerCase();

      switch (operator) {
        case "=":
          return rowValue === formattedValue;
        case "!=":
          return rowValue !== formattedValue;
        case ">":
          return rowValue > formattedValue;
        case "<":
          return rowValue < formattedValue;
        case ">=":
          return rowValue >= formattedValue;
        case "<=":
          return rowValue <= formattedValue;
        default:
          return false;
      }
    });

    return filteredRows.map((row) => {
      const normalizedRow = Object.fromEntries(
        Object.entries(row).map(([key, val]) => [key.toLowerCase(), val])
      );

      if (fields.includes("*")) return normalizedRow;

      const filteredRow = {};
      fields.forEach((f) => {
        const lowerF = f.toLowerCase();
        if (normalizedRow.hasOwnProperty(lowerF)) {
          filteredRow[f] = normalizedRow[lowerF];
        }
      });
      return filteredRow;
    });
  };


  const handleRunQuery = () => {
    const { fields, tableName, condition } = parseQuery(query);

    if (!tableName || !tableData[tableName]) {
      setError(`Invalid table: ${tableName || "Unknown"}`);
      setResult(null);
      return;
    }

    try {
      const data = tableData[tableName];
      const filteredData = filterData(data, condition, fields);

      setSelectedTable(tableName);
      setResult(filteredData.length > 0 ? filteredData : "No results found.");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Invalid query format.");
      setResult(null);
    }
  };

  const handleFullscreen = (section) => {
    setFullscreenSection(fullscreenSection === section ? null : section);
  };

  useEffect(() => {
    localStorage.setItem("fullscreenSection", fullscreenSection);
  }, [fullscreenSection]);

  const isHidden = (section) => fullscreenSection && fullscreenSection !== section;

  return (
    <div className="SQL-Atlan">
      <div className="title">
        <h1>SQL Query Viewer</h1>
      </div>

      <div className="main-container">
        <div className={`SQL-Code-Editor ${fullscreenSection === "editor" ? "fullscreen" : ""} ${isHidden("editor") ? "hidden" : ""}`}>
          <SQLQueryEditor query={query} setQuery={setQuery} height={fullscreenSection === "editor" ? "98vh" : "70vh"} />
          <button className="Run"
            style={{
              bottom: fullscreenSection === "editor" ? "1.8vh" : "4px",
              right: fullscreenSection === "editor" ? "2vh" : "4px",
            }}
            onClick={handleRunQuery}
          >
            Run Query
          </button>
          <div
            className="fullscreen-icon editor-icon"
            style={{
              bottom: fullscreenSection === "editor" ? "2vh" : "5px",
              right: fullscreenSection === "editor" ? "160px" : "150px",
            }}
            onClick={() => handleFullscreen("editor")}
          >
            {fullscreenSection === "editor" ? <FaCompress /> : <FaExpand />}
          </div>
        </div>

        <div className={`SQL-View ${fullscreenSection === "view" ? "fullscreen" : ""} ${isHidden("view") ? "hidden" : ""}`}>
          <div className="Table-View">
            <Table selectedTable={selectedTable} setSelectedTable={setSelectedTable} setQuery={setQuery} fullscreen={fullscreenSection === "view"} />

          </div>
          <div className="fullscreen-icon view-icon" onClick={() => handleFullscreen("view")}
             style={{
              top: fullscreenSection === "view" ? ("41px") : (window.innerWidth <= 860 ? "46px" : "51px"),
              right: fullscreenSection === "view" ? (window.innerWidth <= 860 ? "50px" : "65px") : (window.innerWidth <= 860 ? "39px" : "35px"),
            }}>
            {fullscreenSection === "view" ? <FaCompress /> : <FaExpand />}
          </div>
        </div>
      </div>

      <div className={`SQL-Result ${fullscreenSection === "result" ? "fullscreen" : ""} ${isHidden("result") ? "hidden" : ""}`}>
        <SQLResult result={result} error={error} height={fullscreenSection === "result" ? "100%" : "32vh"} 
        />
        <div className="fullscreen-icon result-icon" onClick={() => handleFullscreen("result")}
          style={{
            top: fullscreenSection === "result" ? "20px" : "10px",
            right: fullscreenSection === "result" ? "20px" : "10px",
          }}>
          {fullscreenSection === "result" ? <FaCompress /> : <FaExpand />}
        </div>

        <div
          className="fullscreen-icon clear-icon broom"
          onClick={() => {setResult(null) 
            setError(null)
          }}
          style={{
            position: "absolute",
            top: fullscreenSection === "result" ? "20px" : "10px",
            right: fullscreenSection === "result" ? "55px" : "45px",
            opacity: (result ||error) ? "1" : "0.5",
            pointerEvents: (result ||error)  ? "auto" : "none",
          }}>
          <FontAwesomeIcon icon={faBroom} />
        </div>
      </div>
    </div>
  );
};

export default App;