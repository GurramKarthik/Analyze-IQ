import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeProvider from "./components/theme-provider";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { ModeToggle } from "./components/Home/Dark";
import LoginTrigger from "./components/Auth/LoginTrigger";
import { useDispatch, useSelector } from "react-redux";
import { PulsatingButton } from "./components/magicui/pulsating-button";
import { ToastContainer } from "react-toastify";
import useLoadData from "./hooks/useLoadData";
import { setDataURL } from "./Store/Dataframe";

const App = () => {

  const {user} = useSelector(store => store.user);
  const {fileURL} = useSelector(store => store.fileURL);

  const navigate = useNavigate();
  const dispatch = useDispatch()

 
  
  
  useLoadData();
  
  return (

    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" className='min-w-screen min-h-screen '>
         <div className="NavBar">
           <ModeToggle />
           {user ? <LoginTrigger/> : <PulsatingButton onClick={()=> navigate("/auth")}>Login</PulsatingButton> }
         </div>


        <SidebarProvider defaultOpen={false}  >
          <AppSidebar />
          <SidebarTrigger className='z-[100]'  />        
          <main className="w-full">

            <Outlet/>
            <ToastContainer/>
          </main>
        </SidebarProvider>
    </ThemeProvider>


  );
};

export default App;
