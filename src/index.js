import React from "react";
import ReactDOM from "react-dom";
import MyTable from "./MyTable";
import "./styles.css";
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App" style={{ padding: 32 }}>
      <h1>Drag and Drop rows to reorder them</h1>
      <MyTable style={{ maxWidth: 800, margin: "0 auto" }} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
