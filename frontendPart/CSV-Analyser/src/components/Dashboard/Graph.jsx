import React, { useRef, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

const ChartVisualizer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const fileInput = useRef(null);

  const handleFileUpload = (event) => {
    event.preventDefault();

    const file = fileInput.current.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        setColumns(Object.keys(results.data[0]));
      },
    });
  };

  const generateCharts = () => {
    const charts = [];


    const numericColumns = columns.filter((col) => !isNaN(data[0][col]));

    
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        charts.push(
          <div key={`scatter-${i}-${j}`} className="w-full md:w-1/2 p-4">
            <Plot
              data={[
                {
                  x: data.map((row) => row[numericColumns[i]]),
                  y: data.map((row) => row[numericColumns[j]]),
                  type: "scatter",
                  mode: "markers",
                  name: `${numericColumns[i]} vs ${numericColumns[j]}`,
                  marker: {
                    color: data.map(
                      (_, index) => ["#FF6F61", "#6B5B95", "#88B04B"][index % 3]
                    ), // Cycle through 3 colors
                    size: 8,
                    opacity: 0.8,
                  },
                },
              ]}
              layout={{
                title: `${numericColumns[i]} vs ${numericColumns[j]}`,
                width: 500,
                height: 400,
                plot_bgcolor: "#F3F4F6", 
                paper_bgcolor: "#FFFFFF",
              }}
            />
          </div>
        );
      }
    }

    
    numericColumns.forEach((col) => {
      charts.push(
        <div key={`bar-${col}`} className="w-full md:w-1/2 p-4">
          <Plot
            data={[
              {
                x: data.map((_, i) => i),
                y: data.map((row) => row[col]),
                type: "bar",
                name: col,
                marker: {
                  color: data.map(
                    (_, index) => ["#FF6F61", "#6B5B95", "#88B04B"][index % 3]
                  ), 
                  opacity: 0.8,
                },
              },
            ]}
            layout={{
              title: `Bar Chart - ${col}`,
              width: 500,
              height: 400,
              plot_bgcolor: "#F3F4F6", // Light gray background for better contrast
              paper_bgcolor: "#FFFFFF",
              xaxis: { title: "Index", tickangle: -45 },
              yaxis: { title: col },
            }}
          />
        </div>
      );
    });

    // Box plots for numeric columns
    numericColumns.forEach((col) => {
      charts.push(
        <div key={`box-${col}`} className="w-full md:w-1/2 p-4">
          <Plot
            data={[
              {
                y: data.map((row) => row[col]),
                type: "box",
                name: col,
              },
            ]}
            layout={{
              title: `Box Plot - ${col}`,
              width: 500,
              height: 400,
            }}
          />
        </div>
      );
    });

    return charts;
  };

  return (
    <div className="p-4">
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          accept=".csv"
          className="mb-4 p->2 border rounded"
          ref={fileInput}
        />
        <button>Submit</button>
      </form>

      {data.length > 0 && (
        <div className="flex flex-wrap -mx-4">{generateCharts()}</div>
      )}
    </div>
  );
};

export default ChartVisualizer;
