import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnergyDashboard from "./components/Dashboard/EnergyDashboard";
import MachineManagement from "./components/Machine Management/MachineManagement";
import Usermanagement from "./components/User Management/Usermanagement";
import Signin from "./components/Sign In/Signin";
import Signup from "./components/Sign up/Signup";
import Alert from "./components/Alerts/Alert";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<EnergyDashboard />} />
        <Route path="/machines" element={<MachineManagement />} />
        <Route path="/user-management" element={<Usermanagement />} />
        <Route path="/alert" element={<Alert />} />
        
      </Routes>
    </Router>
  );
}

export default App;
