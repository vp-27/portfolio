import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import PortfolioSearchProvider from './components/PortfolioSearchProvider'
import { usePortfolioSearch } from './context/portfolioSearch'
import Dashboard from './pages/Dashboard'
import ExperiencePage from './pages/ExperiencePage'
import ProjectsPage from './pages/ProjectsPage'
import EducationPage from './pages/EducationPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PortfolioSearchProvider>
        <PortfolioLayout />
      </PortfolioSearchProvider>
    </MotionConfig>
  )
}

function PortfolioLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const search = usePortfolioSearch()
  return (
    <div className="min-h-screen bg-black text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <TopNav
        onNavigate={(section) => {
          search.clearSearch()
          navigate(section === 'top' ? '/' : `/#${section}`)
        }}
        onSearch={(query) => {
          search.updateQuery(query)
          if (location.pathname !== '/') navigate('/')
        }}
        onAISubmit={search.submitQuery}
        searchQuery={search.query}
      />
      <main id="main-content" tabIndex={-1} className={location.pathname === '/' ? '' : 'md:pt-16'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="*"
            element={
              <div className="max-w-2xl mx-auto px-5 py-20">
                <h1 className="text-2xl mb-3">Page not found</h1>
                <a className="text-rh-green underline" href="/">
                  Back to Vandan’s timeline
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <BottomNav
        searchQuery={search.query}
        onSearch={search.updateQuery}
        onAISubmit={search.submitQuery}
      />
    </div>
  )
}

export default App
