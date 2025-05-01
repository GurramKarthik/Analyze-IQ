
import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Top cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Dataset Info Card Skeleton */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="border-b pb-2 mb-3"></div>
          
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={`info-row-${index}`} className="border-b pb-2">
                <div className="flex justify-between items-center py-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Missing Values Card Skeleton */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="border-b pb-2 mb-3"></div>
          
          <div className="space-y-1">
            <div className="bg-gray-50 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            {[...Array(4)].map((_, index) => (
              <div key={`missing-row-${index}`} className="border-b py-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gray-300 h-2.5 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation Skeleton */}
      <div className="flex border-b mb-4">
        {[...Array(3)].map((_, index) => (
          <div 
            key={`tab-${index}`}
            className={`py-2 px-4 ${index === 0 ? 'border-b-2 border-blue-200' : ''}`}
          >
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
      
      {/* Graph Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={`graph-${index}`} className="bg-white rounded-lg shadow">
            <div className="p-3 border-b">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="p-4" style={{ height: "400px" }}>
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Specific skeleton for the Graph component
const GraphSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={`graph-skeleton-${index}`} className="bg-white rounded-lg shadow">
          <div className="p-3 border-b">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="p-4" style={{ height: "400px" }}>
            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Specific skeleton for numerical analysis
const NumericalAnalysisSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                {[...Array(8)].map((_, index) => (
                  <th key={`num-header-${index}`} className="py-2 px-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={`num-row-${rowIndex}`} className="border-b">
                  {[...Array(8)].map((_, colIndex) => (
                    <td key={`num-cell-${rowIndex}-${colIndex}`} className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Specific skeleton for categorical analysis
const CategoricalAnalysisSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={`cat-card-${index}`} className="bg-white rounded-lg shadow p-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-64 bg-gray-100 rounded mb-3 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, itemIndex) => (
                <div key={`cat-item-${index}-${itemIndex}`} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { 
  DashboardSkeleton, 
  GraphSkeleton,
  NumericalAnalysisSkeleton,
  CategoricalAnalysisSkeleton 
};