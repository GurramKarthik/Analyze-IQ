import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { db } from "@/workers/WebWorker.js";

const Graph = ({ data }) => {
    const [plotData, setPlotData] = useState([]);
    const [graphTitle, setGraphTitle] = useState("Dynamic Graph");

    useEffect(() => {
        async function fetchData() {
            let { x, y, z, values, labels, graph_type, title, color } = data;

            // Fetch data from IndexedDB
            const xData = x ? await db.columnStore.get(x) : null;
            const yData = y ? await db.columnStore.get(y) : null;
            const zData = z ? await db.columnStore.get(z) : null;
            

            // Extract values
            const xValues = xData ? xData.values : [];
            const yValues = yData ? yData.values : [];
            const zValues = zData ? zData.values : [];
            

            // Assign colors dynamically
            const assignedColors = color ? xValues.map((_, i) => color[i % color.length]) : undefined;

            let graph = {};

            // Handle different graph types
            switch (graph_type) {
                case "histogram":
                    graph = {
                        type: "histogram",
                        x: xValues,
                        marker: { color: assignedColors },
                    };
                    break;

                case "bar":
                    graph = {
                        type: "bar",
                        x: xValues,
                        y: yValues,
                        marker: { color: assignedColors },
                    };
                    break;

                case "scatter":
                    graph = {
                        type: "scatter",
                        mode: "markers",
                        x: xValues,
                        y: yValues.length ? yValues : new Array(xValues.length).fill(1), // Default y if missing
                        marker: { color: assignedColors, size: 8 },
                    };
                    break;

                case "pie":
                    graph = {
                        type: "pie",
                        values: values,
                        labels: labels,
                        marker: { colors: assignedColors },
                        hole: 0.4, 
                    };
                    break;

                case "heatmap":
                    graph = {
                        type: "heatmap",
                        z: zValues,
                        x: xValues,
                        y: yValues,
                        colorscale: "Viridis",
                    };
                    break;

                case "treemap":
                    graph = {
                        type: "treemap",
                        labels: labelsArr.length ? labelsArr : xValues,
                        parents: yValues.length ? yValues : undefined,
                        values: valuesArr.length ? valuesArr : undefined,
                        marker: { colors: assignedColors },
                    };
                    break;

                default:
                    console.warn(`Unsupported graph type: ${graph_type}`);
                    return;
            }

            setPlotData([graph]);
            if (title) setGraphTitle(title);
        }

        fetchData();
    }, [data]);

    return (
        <div className="flex flex-col justify-center items-center">
            <Plot
                data={plotData}
                layout={{ width: 440, height: 380, title: graphTitle }}
            />
        </div>
    );
};

export default Graph;
