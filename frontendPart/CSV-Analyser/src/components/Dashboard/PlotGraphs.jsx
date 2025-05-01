import { store } from '@/Store'
import React, {  useState , useMemo , lazy, Suspense} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { DashboardSkeleton } from './SkeletonLoading';
import { setDataURL } from '@/Store/Dataframe';
import { clearDashboardData } from '@/Store/Dashboard';
const Graph =  lazy(() => import('./Graph'));
const NumaricalAnalysis =  lazy(() => import('./NumaricalAnalysis'));
const CategoricalAnalysis  =  lazy(() => import('./CategoricalAnalysis'));


const PlotGraphs =  () => {

  const {content, loading} = useSelector(store => store.dashboardHtml)
  
  
  const dispatch = useDispatch()

  const plots =  useMemo(() => {
    return content ? content?.plots?.map(graph => JSON.parse(graph)) : [];
  }, [content]);
  
  const [activeTab, setActiveTab] = useState('plots');

  
  const handleNewFileBtn = () =>{
    
    dispatch(setDataURL(null))
    dispatch(clearDashboardData())
  }


  if (loading) return  <DashboardSkeleton/>;
  if (!content) return <div className="p-4 text-center">No data available</div>;

  return (
    <div className=" w-full  p-4 bg-gray-50 text-black">
        <button  style={{ backgroundImage: 'linear-gradient(to bottom, #ED4264, #FFEDBC)' }} className='absolute right-[10vw] top-[2.7vh] p-[2rem] pt-[0.7rem] pb-[0.7rem] bg-linear-to-b from-[#DAE2F8] to-[#D6A4A4] rounded-[5px] shadow-md hover:scale-105 transform transition-transform duration-200 active:scale-95 text-white'
                      onClick={handleNewFileBtn}
                      >New File</button>
      <h1 className="text-2xl font-bold text-center mb-6">Dataset Insights Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Dataset Info Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Dataset Information</h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Dataset Name</td>
                <td className="py-2">{content?.dataInfo?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Shape</td>
                <td className="py-2">{content?.dataInfo?.shape[0]} rows × {content?.dataInfo?.shape[1]} columns</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Memory Usage</td>
                <td className="py-2">{content?.dataInfo?.memoryUsage}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Numerical Columns</td>
                <td className="py-2">{content?.dataInfo?.numNumerical}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Categorical Columns</td>
                <td className="py-2">{content?.dataInfo?.numCategorical}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Missing Values Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Missing Values Overview</h2>
          {content?.missingValues?.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 text-left">Column</th>
                  <th className="py-2 text-left">Missing Count</th>
                  <th className="py-2 text-left">Missing %</th>
                </tr>
              </thead>
              <tbody>
                {content?.missingValues.map((col, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{col.name}</td>
                    <td className="py-2">{col.count}</td>
                    <td className="py-2">
                      {col.percentage}%
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div 
                          className="bg-red-300 h-2.5 rounded-full" 
                          style={{ width: `${col.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-green-600">No missing values found in the dataset!</p>
          )}
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b mb-4">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'plots' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('plots')}
        >
          Plots
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'numerical' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('numerical')}
        >
          Numerical Analysis
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'categorical' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('categorical')}
        >
          Categorical Analysis
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Plots Tab */}
        {activeTab === 'plots' && (
          <Suspense>
            <Graph plots={plots} />
          </Suspense>
        )}
        
        {/* Numerical Analysis Tab */}
        {activeTab === 'numerical' && (
          <Suspense>
            <NumaricalAnalysis content = {content} />
          </Suspense>
        )}
        
        {/* Categorical Analysis Tab */}
        {activeTab === 'categorical' && (
          <Suspense>  
            <CategoricalAnalysis categoricalColumns = {content.categoricalColumns} />
         </Suspense>
        )}
      </div>
    </div>
  );
};

export default PlotGraphs;