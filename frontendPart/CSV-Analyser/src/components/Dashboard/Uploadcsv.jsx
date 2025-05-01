
import React, {  useRef, useState } from 'react'
import { BACKEND_END_POINT } from '@/utils/Constants';
import { ToastMessage } from '../Home/ToastMessage';
import { setDataURL } from '@/Store/Dataframe';
import { useDispatch, useSelector } from 'react-redux';
import { addFile, setUser } from '@/Store/User';
import { store } from '@/Store';
import useLoadData from '@/hooks/useLoadData';
import { clearDashboardData } from '@/Store/Dashboard';
import { UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';

const Uploadcsv = () => {
  useLoadData()

  const inputFile = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const { user } = useSelector(store => store.user)

  dispatch(clearDashboardData())

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      inputFile.current.files = e.dataTransfer.files;
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("file", inputFile.current.files[0]);

      const sizeInMB = (inputFile.current.files[0].size / (1024 * 1024)).toFixed(2);
      console.log("size: ", sizeInMB)
      formData.append("size", sizeInMB);

      // Using the fetch API instead of axios
      const response = await fetch(`${BACKEND_END_POINT}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }).then(res => res.json());

      if (response.success) {
        if (response.message === "large") {
          dispatch(setDataURL("large"))
          ToastMessage("File is large", "You can use temporarily")
          return
        }
        console.log("response ", response)
        dispatch(setDataURL(response.file_url))
        dispatch(addFile({ "filename": fileName, "url": response.file_url }))
        ToastMessage("", "Your file has been uploaded")
      } else {
        ToastMessage("Error", response.message)
      }
    } catch (error) {
      ToastMessage("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-[89%] bg-gray-50">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload CSV File</h2>
            <p className="text-gray-500 mb-6">Upload your CSV file to analyze and visualize your data</p>
            
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-10 transition-all text-center cursor-pointer
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'} 
                  ${fileName ? 'border-green-400 bg-green-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputFile.current.click()}
              >
                <input 
                  type="file" 
                  ref={inputFile} 
                  id="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  {fileName ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-green-100 p-3 rounded-full mb-2">
                        <FileText size={24} className="text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium text-lg">{fileName}</p>
                      <p className="text-gray-500 mt-1 flex items-center">
                        <Check size={16} className="mr-1 text-green-500" /> File ready to upload
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <UploadCloud size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium text-lg">Drop your file here or click to browse</p>
                        <p className="text-gray-500 mt-1">Only CSV files are supported</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleSubmit}
                  disabled={!fileName || loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center w-full max-w-xs
                    ${fileName && !loading ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : "Process File"}
                </button>
              </div>
              
              {loading && (
                <div className="text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-500">Processing your file, please wait...</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 py-4 px-8 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <AlertCircle size={16} className="mr-2 text-blue-500" />
              <p>For best results, ensure your CSV file is properly formatted with headers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Uploadcsv