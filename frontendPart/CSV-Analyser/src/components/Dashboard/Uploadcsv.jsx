import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { BACKEND_END_POINT } from '@/utils/Constants';
import { ToastMessage } from '../Home/ToastMessage';
import { setDataURL } from '@/Store/Dataframe';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/Store/User';
import { store } from '@/Store';


const Uploadcsv = () => {

    const inputFile = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading ] = useState(false);
    const [fileName, setFileName] = useState("No file selected");
    const {user} =  useSelector(store => store.user)

    
    
    

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
          setFileName(event.target.files[0].name);
        }
      };
    
    

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true)
        try {        
            const formData = new FormData();
            formData.append("file", inputFile.current.files[0]);

            const response = await axios.post(`${BACKEND_END_POINT}/upload`, formData, {
                headers:{
                    "Content-Type": "multipart/form-data"
                },
                withCredentials:true,
            }).catch((err) =>{
              console.log("error: ",  err)
              
            })

            if(response.data.success){
              if(response.data.message === "large") { 

                dispatch(setDataURL("large"))
                ToastMessage("File is large", "You can use temporarily")
                return
              } 
              console.log("response ", response)
                dispatch(setDataURL(response.data.file_url))
                user.files.push({ "filename" : fileName ,"url" :response.data.file_url })
                dispatch(setUser(user))
                ToastMessage("", "Your file has been uploaded")
            }else{
                ToastMessage("Error", response.data.message)
            }
            
            
        }catch (error) {
            ToastMessage("Error", error.message)
        }finally{
          setLoading(false)
        }

    }

  return (
    <div className='flex flex-row justify-center items-center h-[89%] text-black'>
            <form id="file-upload-form" onSubmit={handleSubmit} className="flex flex-col justify-center  items-center bg-[#f3f3f3] h-[40%] w-[47%] rounded-[7px] boxShadow text-center gap-4" >
                <input type="file" ref={inputFile} id="file" accept=".csv" className="hidden" onChange={handleFileChange}/>
                <div>
                    <button type="button"  onClick={() => inputFile.current.click()} className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:opacity-80"> 
                    Upload File </button>
                    <p className="text-gray-600 text-sm">{fileName}</p>
                </div>
                <button  type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">    Submit </button>
                {loading ? "File is uploading" :""}
                
            </form>

    </div>
  )
}

export default Uploadcsv