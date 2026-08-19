import React, { useEffect, useState } from 'react';
import { getStockManagerDashboardData } from '../api/dashboard';
import { createAsset } from '../api/asset';
import '../styles/StockManagerDashboard.css';
import '../styles/AssetIssuerDashboard.css';

export default function StockManager() {
  const [data, setData] = useState({ assets: [], totalAssets: 0, availableAssets: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [creating, setCreating] = useState(false);
  const [assetForm, setAssetForm] = useState({ assetCode: '', assetName: '', category: '', serialNumber: '', condition: 'GOOD' });

  async function loadDashboard() {
    try {
      setLoading(true);
      const result = await getStockManagerDashboardData();
      setData({ assets: result.assets || [], totalAssets: result.totalAssets || 0, availableAssets: result.availableAssets || 0 });
      setError('');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreateAsset(event) {
    event.preventDefault();
    try {
      setCreating(true);
      await createAsset(assetForm);
      setAssetForm({ assetCode: '', assetName: '', category: '', serialNumber: '', condition: 'GOOD' });
      setNotice('Asset created successfully and inventory refreshed.');
      setError('');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
      setNotice('');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="stock-manager-dashboard">
      <header className="dashboard-header">
        <h1>📦 Stock Manager Dashboard</h1>
        <p>Manage inventory and add assets</p>
      </header>

      <section className="cards-grid">
        <div className="card stat-card">
          <h3>📊 Total Assets</h3>
          <p className="stat-number">{data.totalAssets}</p>
        </div>

        <div className="card stat-card">
          <h3>✅ Available</h3>
          <p className="stat-number">{data.availableAssets}</p>
        </div>
      </section>

      <section className="data-section">
        <h2>Add Asset</h2>
        <form className="role-form" onSubmit={handleCreateAsset}>
          <label>Asset Code<input value={assetForm.assetCode} onChange={(event) => setAssetForm({ ...assetForm, assetCode: event.target.value })} required /></label>
          <label>Asset Name<input value={assetForm.assetName} onChange={(event) => setAssetForm({ ...assetForm, assetName: event.target.value })} required /></label>
          <label>Category<input value={assetForm.category} onChange={(event) => setAssetForm({ ...assetForm, category: event.target.value })} /></label>
          <label>Serial Number<input value={assetForm.serialNumber} onChange={(event) => setAssetForm({ ...assetForm, serialNumber: event.target.value })} /></label>
          <label>Condition<select value={assetForm.condition} onChange={(event) => setAssetForm({ ...assetForm, condition: event.target.value })}><option value="GOOD">Good</option><option value="NEEDS_REPAIR">Needs Repair</option><option value="DAMAGED">Damaged</option></select></label>
          <button className="btn btn-primary" type="submit" disabled={creating}>{creating ? 'Adding...' : 'Add Asset'}</button>
        </form>
        {notice ? <p className="dashboard-empty">{notice}</p> : null}
      </section>

      <section className="data-section">
        <h2>Inventory</h2>
        {loading ? <p className="dashboard-empty">Loading inventory…</p> : error ? <p className="dashboard-empty">{error}</p> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.assets.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.available}</td>
                    <td><span className={`status ${item.available > 0 ? 'in-stock' : 'low-stock'}`}>{item.available > 0 ? 'In Stock' : 'Low Stock'}</span></td>
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
