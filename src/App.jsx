import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ScanQR from './pages/ScanQR'
import Restore from './pages/Restore'
import Reward from './pages/Reward'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/restore" element={<Restore />} />
        <Route path="/reward" element={<Reward />} />
      </Routes>
    </div>
  )
}

export default App
