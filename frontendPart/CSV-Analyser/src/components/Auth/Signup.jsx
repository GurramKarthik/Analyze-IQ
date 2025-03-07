import React, { useRef, useState } from 'react'
import styles from "./Authentication.module.scss"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { BACKEND_END_POINT } from '@/utils/Constants'
import { Loader } from 'lucide-react'
import { toast } from "sonner"
import { ToastMessage } from '../Home/ToastMessage'




const Signup = ({setFlag}) => {

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const checkboxRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading]  = useState(false);



  
  const handleFormSubmit = async (event)=>{
    event.preventDefault();  

    try {

      setLoading(true)

      
      const userDetails = { 
        name : usernameRef.current.value,
        email : emailRef.current.value,
        phone :  phoneRef.current.value,
        password : passwordRef.current.value
       }
  
       if( !userDetails.name.trim() || !userDetails.email.trim()  || !userDetails.phone.trim()  || !userDetails.password.trim()  ){
            setError("Fill all the details");
       }
      if(!checkboxRef.current.checked) setError("Please accpet the terms and conditions");
      const response = await axios.post(`${BACKEND_END_POINT}/register`, userDetails,{
        headers: {
          "Content-Type": "application/json",
        },
          withCredentials: true,
        }).catch((error)=>{
            setError(error.response.data.message || "An error occurred while registering" );
        })  
        
        

        if(response.data.success){
          // opening the login page
            setError("");
            setLoading(false);
            ToastMessage("Hurray", "Registered Successfully :) Please Logins")
            toast({
              title: "Hurray!",
              description: "Registered Successfully :) Please Login",
            })
            setFlag( prev => !prev);           
        }
        
        setLoading(false);
    } catch (error) {
        setError(error.message || "An error occurred" );
    }finally{
      setLoading(false);
    }

    
  }



  
  

 

   



  return (
    <form className={`w-full h-full  ${styles.right}  `} onSubmit={handleFormSubmit}>
        <div >
          <h1 className={ styles.heading }>Join Us and Get Started!</h1>
          <p>Create an account to unlock new features and opportunities</p>
        </div>
        <div className='w-[70%] mt-9'>
          <Label htmlFor="name">User Name</Label>
          <Input ref={usernameRef} type="text" id="name" placeholder="User Name " />
        </div>
        <div className='w-[70%] mt-3'>
          <Label htmlFor="email">Email</Label>
          <Input ref={emailRef} type="email" id="email" placeholder="Email" />
        </div>
        <div className='w-[70%] mt-3'>
          <Label htmlFor="phone">Phone</Label>
          <Input ref={phoneRef} type="text" id="phone" placeholder="Phone Number" />
        </div>
        <div className='w-[70%] mt-3'>
          <Label htmlFor="password">Password</Label>
          <Input ref={passwordRef} type="password" id="password" placeholder="Password" />
        </div>
        <div className='w-[70%] mt-9 flex justify-center items-center'>
        <Checkbox ref={checkboxRef} id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2" >
            Accept terms and conditions
        </label>
        </div>

        { error ? <span style={{color:"rgb(255, 93, 93)"}} >* {error}</span> : <></> }

        {loading ? 
        (
          
          <Loader className="animate-spin w-12 h-12 text-blue-500"/>

        ): (
          <Button className={`w-[70%] bg-[#685dd9] mt-4 ${styles.submitBtn}   `}> Sign Up </Button>
        )
      }
        
        
        <p className='mt-7'>Already ave an account?<span className='text-[#6166f0]' onClick={()=>{setFlag(prev => !prev)}}> Sign In</span> </p>
      </form>
  )
}

export default Signup