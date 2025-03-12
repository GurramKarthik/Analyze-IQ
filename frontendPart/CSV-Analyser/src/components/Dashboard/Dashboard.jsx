import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import Papa from "papaparse";

const Dashboard = () => {
  const [graphs, setGraphs] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load CSV file when component mounts
  useEffect(() => {
    const loadCsv = async () => {
      const response = await fetch("/path-to-your-csv-file.csv"); // Adjust path
      const text = await response.text();
      Papa.parse(text, {
        header: true, // Ensures we get JSON-like objects
        dynamicTyping: true, // Converts numbers properly
        complete: (result) => {
          setCsvData(result.data.filter(row => Object.keys(row).length > 0)); // Remove empty rows
        },
      });
    };

    loadCsv();
  }, []);

  // Fetch graph metadata from backend
  useEffect(() => {
    axios.get("http://localhost:5000/CSV/dashboard")
      .then((response) => {
        if (response.data.success) {
          setGraphs(response.data.graphsMetaData);
        } else {
          console.error("Error:", response.data.message);
        }
      })
      .catch((error) => console.error("Error fetching graphs:", error))
      .finally(() => setLoading(false));
  }, []);

  // Extract data dynamically from CSV based on backend metadata
  const extractColumnData = (columnName) => {
    return csvData.map(row => row[columnName]).filter(value => value !== undefined && value !== null);
  };

  // Function to generate Plotly-compatible chart object
  const renderGraph = (graph, index) => {
    const { graph_type, x, y, color } = graph;

    const plotlyData = [{
      type: graph_type,
      x: x ? extractColumnData(x) : null,
      y: y ? extractColumnData(y) : null,
      marker: color ? { color: extractColumnData(color) } : {}
    }];

    return (
      <Plot
        key={index}
        data={plotlyData}
        layout={{
          title: `Graph ${index + 1} (${graph_type})`,
          autosize: true
        }}
        style={{ width: "100%", height: "400px" }}
      />
    );
  };

  return (
    <div>
      <h2>Dashboard Graphs</h2>
      {loading ? (
        <p>Loading graphs...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {graphs.map((graph, index) => renderGraph(graph, index))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
