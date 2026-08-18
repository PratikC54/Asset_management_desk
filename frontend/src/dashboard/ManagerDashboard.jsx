import React, { useEffect, useState } from 'react';
import { getManagerDashboardData } from '../api/dashboard';
import { updateAssetRequestStatus } from '../api/asset';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import '../styles/ManagerDashboard.css';
import '../styles/AssetIssuerDashboard.css';

export default function ManagerDashboard() {
  const [data, setData] = useState({ pendingRequests: [], pendingCount: 0, approvedCount: 0, inProgressCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [updatingRole, setUpdatingRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ email: '', role: 'ASSET_ISSUER' });

  async function loadDashboard() {
    try {
      setLoading(true);
      const result = await getManagerDashboardData();
      setData({ pendingRequests: result.pendingRequests || [], pendingCount: result.pendingCount || 0, approvedCount: result.approvedCount || 0, inProgressCount: result.inProgressCount || 0 });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleRequestStatus(id, status) {
    try {
      setUpdatingRole(true);
      await updateAssetRequestStatus(id, status);
      setNotice(`Request #${id} ${status.toLowerCase()}.`);
      setError('');
      await loadDashboard();
    } catch (err) { setError(err.message); } finally { setUpdatingRole(false); }
  }

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>👨‍💼 Manager Dashboard</h1>
        <p>Approve and track asset requests</p>
      </header>

      <section className="cards-grid">
        <div className="card stat-card">
          <h3>📋 Pending Requests</h3>
          <p className="stat-number">{data.pendingCount}</p>
        </div>

        <div className="card stat-card">
          <h3>✅ Approved</h3>
          <p className="stat-number">{data.approvedCount}</p>
        </div>

        <div className="card stat-card">
          <h3>📦 In Progress</h3>
          <p className="stat-number">{data.inProgressCount}</p>
        </div>
      </section>

      <section className="data-section">
        <h2>Pending Approvals</h2>
        {loading ? <p className="dashboard-empty">Loading approval queue…</p> : error ? <p className="dashboard-empty">{error}</p> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Employee</th>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.employee}</td>
                    <td>{req.asset}</td>
                    <td>{req.type}</td>
                    <td>{req.date}</td>
                    <td><span className="status pending">{req.status}</span></td>
                    <td className="table-actions"><button className="icon-action approve" title="Approve request" onClick={() => handleRequestStatus(req.id, 'APPROVED')} disabled={updatingRole}><FaCheck /></button><button className="icon-action reject" title="Reject request" onClick={() => handleRequestStatus(req.id, 'REJECTED')} disabled={updatingRole}><FaXmark /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
