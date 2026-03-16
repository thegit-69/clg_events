import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Dashboard from './pages/Dashboard'
import ManageEvents from './pages/ManageEvents'
import CreateEvent from './pages/CreateEvent'
import Attendance from './pages/Attendance'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashboard routes with Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="create" element={<CreateEvent />} />
          <Route path="events/:id/attendance" element={<Attendance />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
