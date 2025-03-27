import React from 'react'

const CategoricalAnalysis = ({categoricalColumns}) => {

  return (
    <div className="bg-white rounded-lg shadow">
    <h3 className="p-3 border-b font-medium">Unique Values for Categorical Variables</h3>
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoricalColumns.map((col, index) => (
          <div key={index} className="border rounded p-3">
            <h4 className="font-medium mb-2">{col.name} <span className="text-sm text-gray-500">({col.uniqueCount} unique values)</span></h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {col.values.map((val, vIndex) => (
                    <tr key={vIndex} className="border-b">
                      <td className="px-3 py-2">{val.value}</td>
                      <td className="px-3 py-2">{val.count}</td>
                      <td className="px-3 py-2">
                        {val.percentage}%
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${val.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default CategoricalAnalysis