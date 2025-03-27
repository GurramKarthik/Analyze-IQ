import { ToastMessage } from "@/components/Home/ToastMessage";
import { store } from "@/Store";
import { BACKEND_END_POINT } from "@/utils/Constants";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setLoading } from "@/Store/Dashboard";

const useLoadData = () =>{
    const dispatch = useDispatch()
    const {fileURL} = useSelector(store => store.fileURL);
    console.log("useLoad")

    useEffect(() => {
    console.log("useEffect calling")
        if(!fileURL) {console.log("fileURL is null"); return }
      
        dispatch(setLoading(true))
        const fetchHtml = async () => {
          try {
            const reqData = {
                "file_url": fileURL
            }
            const response = await axios.post(`${BACKEND_END_POINT}/dashboard`, reqData, {headers:{"Content-Type":"application/json"}, withCredentials:true });
            console.log("reqerr")
            console.log(response.data)
            if(response.data.success){
              
              dispatch(setDashboardData(response.data.results));
            }else{
              ToastMessage("Error", response.data.message)  
            }
          } catch (error) {
            ToastMessage("Error", error.message)
          }
          finally{
            dispatch(setLoading(false))
          }
        };

        fetchHtml();
      }, [fileURL]);
}

export default useLoadData;
