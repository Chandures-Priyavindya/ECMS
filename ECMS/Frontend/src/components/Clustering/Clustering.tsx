
import { useState } from 'react';
import axios from 'axios';
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
import DashboardSidebar from "../Layouts/Dashboardsidebar";

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
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <header>
            <h1 className="text-2xl font-semibold text-gray-800">AI Clustering</h1>
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
