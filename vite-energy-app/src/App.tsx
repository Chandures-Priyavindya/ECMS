import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clustering from './pages/Clustering';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clustering" element={<Clustering />} />
          {/* Add more pages as needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
