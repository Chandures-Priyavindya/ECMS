import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBolt, FaCogs, FaBell, FaUsers, FaCog,FaRobot,FaTachometerAlt } from 'react-icons/fa';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Clustering: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [variables, setVariables] = useState<string[]>([]);
  const [xVar, setXVar] = useState<string>('');
  const [yVar, setYVar] = useState<string>('');
  const [clusters, setClusters] = useState<any[]>([]);
  const [silhouette, setSilhouette] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (!selectedFile) return;

    // Fetch available variables (assumes backend returns variable names)
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await axios.post('/api/clustering/variables', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVariables(res.data.variables || []);
      setXVar(res.data.variables?.[0] || '');
      setYVar(res.data.variables?.[1] || '');
    } catch (err) {
      console.error(err);
      alert('Failed to fetch variables.');
    }
  };

  const handleClustering = async () => {
    if (!file || !xVar || !yVar) return alert('Please upload a file and select variables.');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('xVar', xVar);
    formData.append('yVar', yVar);

    try {
      const res = await axios.post('/api/clustering', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setClusters(res.data.clusters || []);
      setSilhouette(res.data.silhouette_score || null);
    } catch (err) {
      console.error(err);
      alert('Clustering failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      < div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 font-bold text-xl flex items-center">
          <FaBolt className="mr-2" /> EnergyTrack
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <div className="space-y-2">
            <Link to="/" className="flex items-center  hover:text-yellow-400" >
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
            <div className="flex items-center">
              <FaCogs className="mr-2" /> Machines
            </div>
            <Link to="/clustering" className="flex items-center text-yellow-400 font-semibold">
              <FaRobot className="mr-2" />AI Clustering
            </Link>
            <div className="flex items-center">
              <FaBolt className="mr-2" /> Energy Tracker
            </div>
            <div className="flex items-center">
              <FaBell className="mr-2" /> Alerts
            </div>
            <div className="flex items-center">
              <FaUsers className="mr-2" /> User Management
            </div>
          </div>
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="flex items-center">
              <FaCog className="mr-2" /> Settings
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Clustering</h1>
            <p className="text-gray-600">Upload a CSV file, select variables, and discover patterns.</p>
          </header>

          {/* File Upload & Variable Selection */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
            >
              Choose CSV
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {variables.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <select
                  value={xVar}
                  onChange={(e) => setXVar(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  {variables.map((v) => (
                    <option key={v} value={v}>
                      X: {v}
                    </option>
                  ))}
                </select>
                <select
                  value={yVar}
                  onChange={(e) => setYVar(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  {variables.map((v) => (
                    <option key={v} value={v}>
                      Y: {v}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleClustering}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition w-full sm:w-auto"
            >
              {loading ? 'Clustering...' : 'Run Clustering'}
            </button>
          </div>

          {/* Validation Metric */}
          {silhouette !== null && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Validation Metric</h2>
              <p className="text-gray-700">
                Silhouette Score:{' '}
                <span className="font-semibold text-blue-600">
                  {silhouette.toFixed(3)}
                </span>
              </p>
            </div>
          )}

          {/* Scatter Plot */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cluster Scatter Plot</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="101%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name={xVar} />
                  <YAxis dataKey="y" name={yVar} />
                  <Tooltip />
                  <Scatter data={clusters} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cluster Details Table */}
          <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cluster Details</h2>
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">{xVar || 'X'}</th>
                  <th className="px-4 py-2">{yVar || 'Y'}</th>
                  <th className="px-4 py-2">Cluster</th>
                </tr>
              </thead>
              <tbody>
                {clusters.map((point: any, idx) => (
                  <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{idx}</td>
                    <td className="px-4 py-2">{point.x.toFixed(2)}</td>
                    <td className="px-4 py-2">{point.y.toFixed(2)}</td>
                    <td className="px-4 py-2">{point.cluster}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clustering;


