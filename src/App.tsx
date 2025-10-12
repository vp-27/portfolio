import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
