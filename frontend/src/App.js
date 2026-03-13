import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SolarUnits from './pages/SolarUnits';
import SolarUnitDashboard from "./pages/SolarUnitDashboard";
import AddSolarUnit from './pages/AddSolarUnit';
import EditSolarUnit from './pages/EditSolarUnit';
import UserManagement from './pages/UserManagement';
import EditUser from "./pages/EditUser";

// Admin check function
const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

// Protected layout with Navbar
function ProtectedLayout() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Admin route wrapper
function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (with Navbar) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solar-units" element={<SolarUnits />} />
          <Route path="/solar-unit/:unitId" element={<SolarUnitDashboard />} />
          <Route path="/add-solar" element={<AddSolarUnit />} />
          <Route path="/edit-solar/:unitId" element={<EditSolarUnit />} />
          
          {/* Admin Routes */}
          <Route 
            path="/user-management" 
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="/edit-user/:uid" 
            element={
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;