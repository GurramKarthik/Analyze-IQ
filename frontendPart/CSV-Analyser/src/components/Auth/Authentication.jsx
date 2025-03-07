import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import styles from "./Authentication.module.scss"
import { ToastContainer } from "react-toastify";

const Authentication = () => {

  // flag = true > signup  
  const [flag, setFlag] = useState(false);

  return (
    <div className={`h-[100vh] w-[100vw] flex justify-center items-center ${styles.authContainer} `} >
        <div className="left w-[64%] h-full flex justify-center items-center" >
            { 
              flag ? 
                <img src="https://demos.pixinvent.com/vuexy-nextjs-admin-template/demo-4/images/illustrations/auth/v2-register-dark.png" className={`w-full h-[80%]  ${styles.image}`}/>
              :
                <img src="https://demos.pixinvent.com/vuexy-nextjs-admin-template/demo-4/images/illustrations/auth/v2-login-dark.png" className={`w-full h-[80%]  ${styles.image}`}/>
            }
        </div>
        <div className={`w-[36%] h-full ${styles.parent} `}>
            {flag ? <Signup setFlag = {setFlag}/> : <Login setFlag={setFlag}/>}
              
        </div>
        {/* For diplaying toastMessage */}
        <ToastContainer/> 
    </div>
  );
};

export default Authentication;
