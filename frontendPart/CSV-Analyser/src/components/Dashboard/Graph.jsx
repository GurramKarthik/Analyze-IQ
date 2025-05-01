import React, { useState } from "react";
import Plot from "react-plotly.js";

const Graph = ({ plots }) => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  
  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
  };
  
  const handleClosePopup = () => {
    setSelectedPlot(null);
  };
  
  const downloadPlotImage = (graphDiv) => {
    if (!graphDiv) return;
    
    // Use Plotly's toImage function for high quality export
    const options = {
      format: 'png',
      width: 1200,
      height: 800,
      scale: 3 // Higher scale for better quality
    };
    
    Plotly.toImage(graphDiv, options)
      .then(function(dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${selectedPlot?.layout?.title?.text || 'plot'}.png`;
        link.click();
      })
      .catch(function(error) {
        console.error('Error downloading image:', error);
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plots?.map((plot, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handlePlotClick(plot)}
          >
            <h3 className="p-3 border-b font-medium">
              {plot?.layout?.title?.text || `Graph ${index + 1}`}
            </h3>
            <div className="p-4" style={{ height: "400px" }}>
              {plot?.data && plot?.layout ? (
                <Plot
                  data={plot.data}
                  layout={plot.layout}
                  style={{ width: "100%", height: "100%" }}
                  config={{ displayModeBar: false }}
                />
              ) : (
                <p>Failed to load graph</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedPlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedPlot?.layout?.title?.text || "Plot Details"}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Get access to the Plotly graph div after it's rendered
                    const graphDiv = document.getElementById('popup-plot').getElementsByClassName('js-plotly-plot')[0];
                    downloadPlotImage(graphDiv);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Download
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePopup();
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-4" style={{ height: "80vh" }} id="popup-plot">
              <Plot
                data={selectedPlot.data}
                layout={{
                  ...selectedPlot.layout,
                  autosize: true,
                  height: null,
                  width: null
                }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
                config={{
                  responsive: true,
                  toImageButtonOptions: {
                    format: 'png',
                    filename: selectedPlot?.layout?.title?.text || 'plot',
                    height: 2000,
                    width: 2400,
                    scale: 3
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Graph;