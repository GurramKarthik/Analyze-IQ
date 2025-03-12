import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeProvider from "./components/theme-provider";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { ModeToggle } from "./components/Home/Dark";
import LoginTrigger from "./components/Auth/LoginTrigger";
import { useSelector } from "react-redux";
import { PulsatingButton } from "./components/magicui/pulsating-button";
import { ToastContainer } from "react-toastify";

const App = () => {

  const {user} = useSelector(store => store.user);
  const navigate = useNavigate();

  
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    //   <SidebarProvider defaultOpen={"false"}>
    //   <AppSidebar className="flex-none" />

    //     <div className="NavBar">
    //       <ModeToggle />
    //       {user ? <LoginTrigger/> : <PulsatingButton onClick={()=> navigate("/auth")}>Login</PulsatingButton> }
    //     </div>

    //     <div className="min-h-screen w-screen flex flex-row ">

    //       <div className="grow w-[100%] min-h-screen">
    //           <SidebarTrigger className="sidebarTrigger"  />
    //           <Outlet />
    //           <ToastContainer/>
    //       </div>
    //     </div>
    //   </SidebarProvider>
    // </ThemeProvider>

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" className='min-w-screen min-h-screen'>
         <div className="NavBar">
           <ModeToggle />
           {user ? <LoginTrigger/> : <PulsatingButton onClick={()=> navigate("/auth")}>Login</PulsatingButton> }
         </div>

        <SidebarProvider>
          <AppSidebar/>
        
          <main className="w-full">
            <SidebarTrigger />
            <Outlet/>
            <ToastContainer/>
          </main>
        </SidebarProvider>
    </ThemeProvider>


  );
};

export default App;
