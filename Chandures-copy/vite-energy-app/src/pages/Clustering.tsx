


import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaBolt, FaCogs, FaBell, FaUsers, FaCog, FaRobot, FaTachometerAlt,
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Clustering: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [variables, setVariables] = useState<string[]>([]);
  const [xVar, setXVar] = useState<string>('');
  const [yVar, setYVar] = useState<string>('');
  const [clusters, setClusters] = useState<any[]>([]);
  const [silhouette, setSilhouette] = useState<number | null>(null);
  const [numClusters, setNumClusters] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('/api/clustering/variables', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVariables(res.data.variables || []);
      setXVar(res.data.variables?.[0] || '');
      setYVar(res.data.variables?.[1] || '');
      setClusters([]);
      setSilhouette(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch variables.');
    }
  };

  const handleClustering = async () => {
    if (!file) return setError('Please upload a file.');
    if (!xVar || !yVar) return setError('Please select both X and Y variables.');

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('xVar', xVar);
    formData.append('yVar', yVar);
    formData.append('numClusters', numClusters.toString());

    try {
      const res = await axios.post('/api/clustering', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setClusters(res.data.clusters || []);
        setSilhouette(res.data.silhouette_score || null);
      }
    } catch (err) {
      console.error(err);
      setError('Clustering failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setVariables([]);
    setXVar('');
    setYVar('');
    setClusters([]);
    setSilhouette(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-4 font-bold text-xl flex items-center">
          <FaBolt className="mr-2" /> EnergyTrack
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <Link to="/" className="flex items-center hover:text-yellow-400">
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
          <div className="flex items-center"><FaCogs className="mr-2" /> Machines</div>
          <Link to="/clustering" className="flex items-center text-yellow-400 font-semibold">
            <FaRobot className="mr-2" /> AI Clustering
          </Link>
          <div className="flex items-center"><FaBolt className="mr-2" /> Energy Tracker</div>
          <div className="flex items-center"><FaBell className="mr-2" /> Alerts</div>
          <div className="flex items-center"><FaUsers className="mr-2" /> User Management</div>
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="flex items-center"><FaCog className="mr-2" /> Settings</div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Clustering</h1>
            <p className="text-gray-600">Upload CSV, select variables, choose cluster count, and analyze patterns.</p>
          </header>

          {/* Controls */}
          <section className="bg-white rounded-lg shadow p-6 flex flex-wrap gap-4 items-center">
            <label htmlFor="file-upload" className="border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
              Choose CSV
              <input type="file" id="file-upload" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>

            {variables.length > 0 && (
              <>
                <select value={xVar} onChange={(e) => setXVar(e.target.value)} className="border rounded px-3 py-2">
                  {variables.map(v => <option key={v} value={v}>X: {v}</option>)}
                </select>
                <select value={yVar} onChange={(e) => setYVar(e.target.value)} className="border rounded px-3 py-2">
                  {variables.map(v => <option key={v} value={v}>Y: {v}</option>)}
                </select>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={numClusters}
                  onChange={(e) => setNumClusters(parseInt(e.target.value))}
                  className="border rounded px-3 py-2 w-28"
                  placeholder="Clusters"
                />
              </>
            )}

            <button
              onClick={handleClustering}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Clustering...' : 'Run Clustering'}
            </button>

            <button onClick={resetAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Reset
            </button>
          </section>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Silhouette Score */}
          {silhouette !== null && (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Validation Metric</h2>
              <p className="text-gray-700">Silhouette Score: <span className="text-blue-600 font-semibold">{silhouette.toFixed(3)}</span></p>
            </section>
          )}

          {/* Bubble Chart */}
          {clusters.length > 0 && (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cluster Bubble Plot ({[...new Set(clusters.map((c) => c.cluster))].length} Clusters)
              </h2>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name={xVar} label={{ value: xVar, position: 'insideBottomRight', offset: -10 }} />
                    <YAxis type="number" dataKey="y" name={yVar} label={{ value: yVar, angle: -90, position: 'insideleft' ,dx: -20}} />
                    <Tooltip formatter={(val: number) => val.toFixed(2)} />
                    <Legend />
                    {[...new Set(clusters.map(c => c.cluster))].map((clusterId, idx) => (
                      <Scatter
                        key={clusterId}
                        name={`Cluster ${clusterId}`}
                        data={clusters.filter(c => c.cluster === clusterId)}
                        fill={['#3b82f6', '#f97316', '#10b981', '#e11d48', '#6366f1', '#22d3ee', '#a855f7', '#facc15'][idx % 8]}
                        shape="circle"
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Clustering;
