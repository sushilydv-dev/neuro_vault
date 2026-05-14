import React from "react";
import { AppFooter, AppHeader, AppSidebar } from "../../coreui/components";

import "../../coreui/scss/style.scss";
import { LayoutProvider } from "../../coreui/LayoutContext";

import { Outlet } from "react-router-dom";
export const Worspace = () => {
  return (
    <LayoutProvider>
      <div className="nv-page min-h-screen">
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1 ">
            <div className="container-lg px-4 pb-6 h-full">
              <Outlet />
            </div>
          </div> 
          
        </div>
      </div>
    </LayoutProvider>
  );
};

export default Worspace;
