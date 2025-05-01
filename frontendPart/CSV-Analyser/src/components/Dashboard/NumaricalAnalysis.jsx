import React, { memo } from 'react'


const NumaricalAnalysis = memo(({ content }) => {
    
    
    return (
      <div className="space-y-6">
      {/* Descriptive Statistics */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="p-3 border-b font-medium">Descriptive Statistics</h3>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Std</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">25%</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">50%</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">75%</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.describe.map((row, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap">{row.column}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.count}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.mean}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.std}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.min}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row['25%']}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row['50%']}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row['75%']}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kurtosis Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h3 className="p-3 border-b font-medium">Kurtosis Analysis</h3>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kurtosis</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {content.kurtosis.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2">{row.column}</td>
                    <td className="px-3 py-2">{row.value.toFixed(4)}</td>
                    <td className="px-3 py-2">
                      {row.value > 3 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Leptokurtic</span>
                      ) : row.value < 3 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Platykurtic</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Mesokurtic</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Column Types Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h3 className="p-3 border-b font-medium">Column Data Types</h3>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                </tr>
              </thead>
              <tbody>
                {content.columnTypes.map((col, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2">{col.name}</td>
                    <td className="px-3 py-2"><code className="bg-gray-100 px-1 py-0.5 rounded">{col.dtype}</code></td>
                    <td className="px-3 py-2">
                      {col.isNumerical ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Numerical</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Categorical</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    );
  });
  

export default NumaricalAnalysis