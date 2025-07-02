
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
import Header from "../Layouts/Header";
import { FiUploadCloud, FiFileText, FiAlertCircle } from "react-icons/fi";

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
    <div className="flex w-full bg-gray-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 space-y-4">
        <Header
          title="AI Clustering"
          subtitle="Upload CSV, select variables, choose cluster count, and analyze patterns"
        />

        <main className="flex-1 p-6 space-y-6">
          {/* Step 1: Upload CSV */}
          <section className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4"> Upload CSV File</h2>
            <div className="flex items-center gap-6">
              <label htmlFor="file-upload" className="flex items-center space-x-2 border-2 border-dashed border-gray-400 p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                <FiUploadCloud size={24} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Click to upload</span>
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-700">
                  <FiFileText className="text-gray-500" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            {!file && (
              <p className="text-sm text-gray-500 italic mt-2">No file selected yet.</p>
            )}
          </section>

          {/* Step 2: Select Variables */}
          {variables.length > 0 && (
            <section className="bg-white p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Variables and Cluster Count</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-600">X Variable</label>
                  <select value={xVar} onChange={(e) => setXVar(e.target.value)} className="w-full border rounded px-3 py-2">
                    {variables.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Y Variable</label>
                  <select value={yVar} onChange={(e) => setYVar(e.target.value)} className="w-full border rounded px-3 py-2">
                    {variables.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Number of Clusters</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={numClusters}
                    onChange={(e) => setNumClusters(parseInt(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Clusters"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleClustering}
                    disabled={loading || !xVar || !yVar || !file}
                    className={`flex-1 px-4 py-2 rounded transition ${
                      loading || !xVar || !yVar || !file
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-[#091053]  text-white'
                    }`}
                  >
                    {loading ? 'Clustering...' : 'Run Clustering'}
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-3 flex items-center text-sm text-red-600">
                  <FiAlertCircle className="mr-2" />
                  {error}
                </div>
              )}
            </section>
          )}

          {/* Step 3: Silhouette Score */}
          {silhouette !== null && (
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Validation Metric</h2>
              <p className="text-gray-700">
                Silhouette Score:{' '}
                <span className="text-blue-600 font-semibold">{silhouette.toFixed(3)}</span>
              </p>
              {silhouette < 0.25 && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Low silhouette score — clustering may not be meaningful.
                </p>
              )}
            </section>
          )}

          {/* Step 4: Cluster Bubble Plot */}
          {clusters.length > 0 && (
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cluster Bubble Plot ({[...new Set(clusters.map((c) => c.cluster))].length} Clusters)
              </h2>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={xVar}
                      label={{ value: xVar, position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={yVar}
                      label={{ value: yVar, angle: -90, position: 'insideleft', dx: -20 }}
                    />
                    <Tooltip formatter={(val: number) => val.toFixed(2)} />
                    <Legend />
                    {[...new Set(clusters.map(c => c.cluster))].map((clusterId, idx) => (
                      <Scatter
                        key={clusterId}
                        name={`Cluster ${clusterId}`}
                        data={clusters.filter(c => c.cluster === clusterId)}
                        fill={
                          ['#3b82f6', '#f97316', '#10b981', '#e11d48', '#6366f1', '#22d3ee', '#a855f7', '#facc15'][idx % 8]
                        }
                        shape="circle"
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Clustering;
