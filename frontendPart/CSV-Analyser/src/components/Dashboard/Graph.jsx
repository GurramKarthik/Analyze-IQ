import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Graph = ({ plots }) => {
   return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {plots?.map((plot, index) => (
        <div key={index} className="bg-white rounded-lg shadow">
          <h3 className="p-3 border-b font-medium">
            {plot?.layout?.title?.text || `Graph ${index + 1}`}
          </h3>
          <div className="p-4" style={{ height: "400px" }}>
            {plot?.data && plot?.layout ? (
              <Plot
                data={plot.data}
                layout={plot.layout}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <p>Failed to load graph</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Graph;
