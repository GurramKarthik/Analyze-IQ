import React from "react";
import { Outlet } from "react-router-dom";

const Authentication = () => {
  return (
    <div>
      <div className="h-full">
        <div className="NavBar">
          <ModeToggle />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        {children}
      </div>
      <Outlet/>
    </div>
  );
};

export default Authentication;
