import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const SQLQueryEditor = ({ query, setQuery, height }) => {
  const viewportHeight = window.innerHeight; 
  const pxToVh = (40 / viewportHeight) * 100; 
  const adjustedHeight = `calc(${height} - ${pxToVh}vh)`; 

  const handleChange = (value) => {
    setQuery(value);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2" style={{ marginLeft: "3px" }}>
        SQL Query Editor
      </h2>

      <CodeMirror
        value={query}
        height={adjustedHeight}
        style={{ width: "100%", overflow: "auto" }}
        theme={vscodeDark}
        extensions={[sql()]}
        onChange={handleChange}
      />
    </div>
  );
};

export default SQLQueryEditor;
