import { Routes, Route, Navigate } from "react-router-dom";
import TablePage from "./pages/TablePage";
import AddRecord from "./pages/AddRecord";
import ViewRecord from "./pages/ViewRecord";
import Login from "./pages/Login"; // New
import Dashboard from "./pages/Dashboard/Dashboard"; // New
import ProtectedRoute from "./utils/ProtectedRoute"; // New

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes - Wrapping your existing pages */}
      <Route path="/qrs" element={
        <ProtectedRoute>
          <TablePage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/add" element={
        <ProtectedRoute>
          <AddRecord />
        </ProtectedRoute>
      } />

      <Route path="/record/:id" element={
        <ProtectedRoute>
          <ViewRecord />
        </ProtectedRoute>
      } />

      <Route path="/edit/:id" element={
        <ProtectedRoute>
          <AddRecord />
        </ProtectedRoute>
      } />

      {/* Fallback to login if route doesn't exist */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}