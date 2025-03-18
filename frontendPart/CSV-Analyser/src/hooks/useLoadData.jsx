import { ToastMessage } from '@/components/Home/ToastMessage';
import { store } from '@/Store'
import { setDatainBackend, setDataLoading } from '@/Store/Dataframe';
import { BACKEND_END_POINT } from '@/utils/Constants';
import axios from 'axios';
import Dexie from 'dexie';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Worker from "@/workers/WebWorker?worker";
import { setMetaData } from '@/Store/Metadata';




const useLoadData = () => {
    const {fileURL} = useSelector(store => store.fileURL);
    const dispatch = useDispatch();
    
    const getData = async () => {
      console.log("plot graph effect");
      try {
          const obj = { file_url: fileURL };
          const response = await axios.post(`${BACKEND_END_POINT}/dashboard`, obj, {
              headers: {
                  "Content-Type": "application/json"
              }, withCredentials: true
          });

          if (response.data.success) {

              console.log("mata", response);
              dispatch(setMetaData(response.data.graphsMetaData));
          } else {
              console.log(response);
              ToastMessage("Error", response.data.message);
          }
      } catch (error) {
          console.log(error.message);
          ToastMessage("Error", error.message);
      }
    };

    useEffect( ()=>{
        console.log("in load Data")
        dispatch(setDataLoading(true)) 
        const worker  = new Worker();
        const fetchFun = async () =>{
         try {
              worker.postMessage(  fileURL );
              worker.onmessage = (e) => {
                  if (!e.data.success) ToastMessage("Error", "Error in pushin the data in indexDB")
                    dispatch(setDataLoading(false)) 
              };
              getData();
          } catch (error) {
              ToastMessage("Error", error.message)
          }  
      }

      fetchFun();
   

      // Cleanup on unmount
      return () => {
          worker.terminate(); 
        };
  } , [fileURL] )

    

}

export default useLoadData