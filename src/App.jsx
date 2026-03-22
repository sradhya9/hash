import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ScanQR from './pages/ScanQR'
import Reward from './pages/Reward'
import Restore from './pages/Restore'
import Admin from './pages/Admin'
import Goodbye from './pages/Goodbye'
import GreekBackground from './components/GreekBackground'

function App() {
  return (
    <div className="app-container">
      <GreekBackground />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/restore" element={<Restore />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/goodbye" element={<Goodbye />} />
      </Routes>
    </div>
  )
}

export default App
