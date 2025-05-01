import React, { useRef, useState } from 'react'
import styles from "./Authentication.module.scss"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Store/User'
import { Loader } from 'lucide-react'
import axios from 'axios'
import { BACKEND_END_POINT } from '@/utils/Constants'
import { ToastMessage } from '../Home/ToastMessage'


const Login = ({setFlag}) => {


    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [error, setError] = useState("");
    const [loading, setLoading]  = useState(false);

    const navigate = useNavigate();
    const dispatch  = useDispatch();


  const handleFormSubmit = async (event)=>{
      event.preventDefault();

      try {

        setLoading(true)
        
        console.log("hai");
        const userDetails = { 
          email : emailRef.current.value,
          password : passwordRef.current.value
         }
    
         if(  !userDetails.email.trim()  || !userDetails.password.trim()  ){
              setError("Fill all the details");
         }

        const response = await axios.post(`${BACKEND_END_POINT}/login`, userDetails,{
          headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          }).catch((error)=>{
            console.log("error in rs", error)
              ToastMessage( error.response.data.message);
          })  
          
          
          console.log(" hao",response.data.success);
          
  
          if(response.data.success){
            // opening the home page
    
              console.log(" hhh "); 
              dispatch(setUser(response.data.user))
              navigate("/");

              setError("");
              setLoading(false);
              ToastMessage("Logged In.", "You are free to use any service now!>>>>")
                  
          }else{
            console.log(response.data.message)
            ToastMessage("Error", response.data)
          }
          
          setLoading(false);
      } catch (error) {
          setError(error.message || "An error occurred" );
      }finally{
        setLoading(false);
        setError("");
      }
  
  }

  return (
    <form className={`w-full h-full  ${styles.right}  `} onSubmit={handleFormSubmit}>
      <div >
        <h1 className={ styles.heading }>Welcome Back! Ready to Dive In?</h1>
        <p>Access your dashboard and unlock new possibilities</p>
      </div>

      <div className='w-[70%] mt-9'>
        <Label htmlFor="email">Email</Label>
        <Input ref={emailRef} type="email" id="email" placeholder="Email" />
      </div>
      <div className='w-[70%] mt-3'>
        <Label htmlFor="password">Password</Label>
        <Input ref={passwordRef} type="password" id="password" placeholder="Password" />
      </div>


      { error ? <span style={{color:"rgb(255, 93, 93)"}} >* {error}</span> : <></> }

      {loading ? 
      ( 
        <Loader className="animate-spin w-12 h-12 text-blue-500"/>

      ): (
        <Button className={`w-[70%] bg-[#685dd9] mt-4 ${styles.submitBtn}   `}> Sign In </Button>
      )
      }
      <p className='mt-7'>New to use it? <span className='text-[#6166f0]' onClick={()=>{setFlag(prev => !prev)}}> Create your account here</span> </p>
    </form>

  )
}

export default Login