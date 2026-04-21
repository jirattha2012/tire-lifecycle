import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import TireForm from "./Pages/TireForm.jsx";
import Result from "./Pages/Result.jsx";


function App() {
  return (
    // <div>
    //   <Dashboard />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TireForm />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
