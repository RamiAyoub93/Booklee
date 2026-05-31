import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import CompanyPage from './pages/public/CompanyPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import MyBookings from './pages/customer/MyBookings'
import BookingPage from './pages/customer/BookingPage'
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyBookings from './pages/company/CompanyBookings'
import ManageServices from './pages/company/ManageServices'
import ManageAvailability from './pages/company/ManageAvailability'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/companies/:id" element={<CompanyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer */}
            <Route path="/dashboard" element={<ProtectedRoute role="Customer"><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute role="Customer"><MyBookings /></ProtectedRoute>} />
            <Route path="/book/:companyId" element={<ProtectedRoute role="Customer"><BookingPage /></ProtectedRoute>} />

            {/* Owner */}
            <Route path="/company/dashboard" element={<ProtectedRoute role="Owner"><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/bookings" element={<ProtectedRoute role="Owner"><CompanyBookings /></ProtectedRoute>} />
            <Route path="/company/services" element={<ProtectedRoute role="Owner"><ManageServices /></ProtectedRoute>} />
            <Route path="/company/availability" element={<ProtectedRoute role="Owner"><ManageAvailability /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
