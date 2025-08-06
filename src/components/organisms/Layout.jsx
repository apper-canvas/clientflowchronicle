import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={handleMobileSidebarClose} 
      />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet context={{ onMobileMenuToggle: handleMobileMenuToggle }} />
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleMobileSidebarClose}
/>
      )}
    </div>
  );
}

export default Layout;