import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeProvider from "./components/theme-provider";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./SideBar";
import { ModeToggle } from "./components/Home/Dark";
import LoginTrigger from "./components/Auth/LoginTrigger";
import { useSelector } from "react-redux";
import { PulsatingButton } from "./components/magicui/pulsating-button";
import { ToastContainer } from "react-toastify";

const App = () => {

  const {user} = useSelector(store => store.user);
  const navigate = useNavigate();

  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={"false"}>
        <div className="NavBar">
          <ModeToggle />
          {user ? <LoginTrigger/> : <PulsatingButton onClick={()=> navigate("/auth")}>Login</PulsatingButton> }
        </div>

        <div className="min-h-screen w-screen flex flex-row ">

          <AppSidebar className="flex-none" />
          <div className="grow w-[100%] ">
              <SidebarTrigger className="sidebarTrigger"  />
              <Outlet />
              <ToastContainer/>
          </div>
        </div>

      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
