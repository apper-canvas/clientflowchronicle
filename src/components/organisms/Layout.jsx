import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }
  
  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={handleMobileSidebarClose} 
      />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <Outlet context={{ onMobileMenuToggle: handleMobileMenuToggle }} />
        </main>
      </div>
    </div>
  )
}

export default Layout