import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EnergyDashboard from "./components/Dashboard/EnergyDashboard";
import MachineManagement from "./components/Machine Management/MachineManagement";
import Usermanagement from "./components/User Management/Usermanagement";
import Signin from "./components/Sign In/Signin";
import Signup from "./components/Sign up/Signup";
import Alert from "./components/Alerts/Alert";
import Clustering from "./components/Clustering/Clustering";
import EnergyTracker from "./components/Energy Tracking/EnergyTracker";
import Settings from "./components/Settings/Settings";
import AddUser from "./components/User Management/Adduser";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (!token || !tokenExpiry) {
    // No token or expiry date, so redirect to sign-in
    return <Navigate to="/signin" />;
  }

  const expiryDate = new Date(tokenExpiry);
  if (expiryDate < new Date()) {
    // If the token has expired, clear it and redirect to sign-in
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return <Navigate to="/signin" />;
  }

  // If the token exists and is valid, show the protected route
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <EnergyDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/machines"
          element={
            <PrivateRoute>
              <MachineManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <PrivateRoute>
              <Usermanagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/alert"
          element={
            <PrivateRoute>
              <Alert />
            </PrivateRoute>
          }
        />
        <Route
          path="/clustering"
          element={
            <PrivateRoute>
              <Clustering />
            </PrivateRoute>
          }
        />
        <Route
          path="/energy-tracker"
          element={
            <PrivateRoute>
              <EnergyTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <PrivateRoute>
              <AddUser />
            </PrivateRoute>
          }
          
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
          
        />

        {/* Catch-all route for undefined pages */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;


