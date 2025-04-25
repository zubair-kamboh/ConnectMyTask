// ConnectMyTask App Setup with Routing and Material UI

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import Home from './pages/Home'

import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}
