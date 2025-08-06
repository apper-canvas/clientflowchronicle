import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Contacts from "@/components/pages/Contacts"
import Deals from "@/components/pages/Deals"
import Activities from "@/components/pages/Activities"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="deals" element={<Deals />} />
            <Route path="activities" element={<Activities />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        className="mt-16"
        toastClassName="shadow-xl"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App