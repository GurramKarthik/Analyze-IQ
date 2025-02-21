import React from "react";
// import Layout from './components/Layout'
import { Outlet } from "react-router-dom";
import HeroSection from "./components/Home/HeroSection";
import Layout from "./Layout";
import ThemeProvider from "./components/theme-provider";
import Home from "./components/Home/Home";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./SideBar";
import { ModeToggle } from "./components/Home/Dark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginTrigger from "./components/Auth/LoginTrigger";

const App = () => {
  return (
    // <Layout>
    //      <Outlet/>
    //  </Layout>

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="NavBar">
          <ModeToggle />
          <LoginTrigger/>
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}

        </div>

        <div className="min-h-screen w-screen flex flex-row ">

          <AppSidebar className="flex-none" />
          <div className="grow w-[100%] ">
              <SidebarTrigger className="sidebarTrigger" />
              <Outlet />
          </div>
        </div>

      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
