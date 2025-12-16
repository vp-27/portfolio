import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ExperiencePage from './pages/ExperiencePage'
import ProjectsPage from './pages/ProjectsPage'
import EducationPage from './pages/EducationPage'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/education" element={<EducationPage />} />
      </Routes>
    </div>
  )
}

export default App
