import React, { useEffect, useState } from 'react';
import { getAssetIssuerDashboardData } from '../api/dashboard';
import { getAvailableAssets, issueAsset, returnAsset } from '../api/asset';
import '../styles/AssetIssuerDashboard.css';

export default function AssetIssuerDashboard() {
  const [data, setData] = useState({ approvedRequests: [], pendingReturnRequests: [], issuedAssets: [], receivedAssets: [], issuedToday: 0, receivedToday: 0 });
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [issueForm, setIssueForm] = useState({ assetRequestId: '', assetId: '', employeeId: '', expectedReturnDate: '', remarks: '' });
  const [returnForm, setReturnForm] = useState({ returnRequestId: '', issueId: '', returnedCondition: 'GOOD', remarks: '' });

  async function loadData() {
    try {
      setLoading(true);
      const [result, assets] = await Promise.all([getAssetIssuerDashboardData(), getAvailableAssets()]);
      setData({ approvedRequests: result.approvedRequests || [], pendingReturnRequests: result.pendingReturnRequests || [], issuedAssets: result.issuedAssets || [], receivedAssets: result.receivedAssets || [], issuedToday: result.issuedToday || 0, receivedToday: result.receivedToday || 0 });
      setAvailableAssets(assets || []);
      setError('');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  useEffect(() => { loadData(); }, []);

  function selectApprovedRequest(id) {
    const request = data.approvedRequests.find((item) => item.id === Number(id));
    setIssueForm({ ...issueForm, assetRequestId: id, employeeId: request?.requesterId || request?.employeeId || '' });
  }

  async function handleIssue(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      await issueAsset({ ...issueForm, assetRequestId: Number(issueForm.assetRequestId), assetId: Number(issueForm.assetId), employeeId: Number(issueForm.employeeId), expectedReturnDate: issueForm.expectedReturnDate || null });
      setIssueForm({ assetRequestId: '', assetId: '', employeeId: '', expectedReturnDate: '', remarks: '' });
      setNotice('Asset issued successfully.');
      await loadData();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  }

  function selectReturnRequest(id) {
    const request = data.pendingReturnRequests.find((item) => item.id === Number(id));
    setReturnForm({ ...returnForm, returnRequestId: id, issueId: request?.issueId || '' });
  }

  async function handleReturn(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      await returnAsset({ ...returnForm, returnRequestId: Number(returnForm.returnRequestId), issueId: Number(returnForm.issueId) });
      setReturnForm({ returnRequestId: '', issueId: '', returnedCondition: 'GOOD', remarks: '' });
      setNotice('Return approved and asset marked as returned.');
      await loadData();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  }

  return <div className="asset-issuer-dashboard">
    <header className="dashboard-header"><h1>Asset Issuer Dashboard</h1><p>Fulfil approved requests and approve returned assets.</p></header>
    <section className="cards-grid"><div className="card stat-card"><h3>Approved to issue</h3><p className="stat-number">{data.approvedRequests.length}</p></div><div className="card stat-card"><h3>Returns awaiting approval</h3><p className="stat-number">{data.pendingReturnRequests.length}</p></div></section>
    {notice ? <p className="dashboard-empty">{notice}</p> : null}{error ? <p className="dashboard-empty">{error}</p> : null}
    <section className="data-section"><h2>Manager-approved requests</h2>{loading ? <p className="dashboard-empty">Loading requests...</p> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Request</th><th>Employee</th><th>Asset requested</th><th>Date</th></tr></thead><tbody>{data.approvedRequests.length ? data.approvedRequests.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{item.employee}</td><td>{item.asset}</td><td>{item.date}</td></tr>) : <tr><td colSpan="4">No approved requests are waiting to be issued.</td></tr>}</tbody></table></div>}</section>
    <section className="data-section"><h2>Issue approved asset</h2><form className="role-form" onSubmit={handleIssue}>
      <label>Approved request<select value={issueForm.assetRequestId} onChange={(event) => selectApprovedRequest(event.target.value)} required><option value="">Select an approved request</option>{data.approvedRequests.map((request) => <option key={request.id} value={request.id}>#{request.id} — {request.employee}: {request.asset}</option>)}</select></label>
      <label>Asset to issue<select value={issueForm.assetId} onChange={(event) => setIssueForm({ ...issueForm, assetId: event.target.value })} required><option value="">Select an available asset</option>{availableAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.assetName} ({asset.assetCode})</option>)}</select></label>
      <label>Expected return<input type="date" value={issueForm.expectedReturnDate} onChange={(event) => setIssueForm({ ...issueForm, expectedReturnDate: event.target.value })} /></label><label>Remarks<input value={issueForm.remarks} onChange={(event) => setIssueForm({ ...issueForm, remarks: event.target.value })} /></label><button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Issue asset'}</button>
    </form></section>
    <section className="data-section"><h2>Return requests awaiting approval</h2>{loading ? <p className="dashboard-empty">Loading returns...</p> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Request</th><th>Employee</th><th>Asset</th><th>Status</th></tr></thead><tbody>{data.pendingReturnRequests.length ? data.pendingReturnRequests.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{item.employee}</td><td>{item.asset}</td><td>{item.status}</td></tr>) : <tr><td colSpan="4">No returns are awaiting approval.</td></tr>}</tbody></table></div>}</section>
    <section className="data-section"><h2>Approve return</h2><form className="role-form" onSubmit={handleReturn}><label>Return request<select value={returnForm.returnRequestId} onChange={(event) => selectReturnRequest(event.target.value)} required><option value="">Select a pending return</option>{data.pendingReturnRequests.map((request) => <option key={request.id} value={request.id}>#{request.id} — {request.employee}: {request.asset}</option>)}</select></label><label>Condition<select value={returnForm.returnedCondition} onChange={(event) => setReturnForm({ ...returnForm, returnedCondition: event.target.value })}><option value="GOOD">Good</option><option value="NEEDS_REPAIR">Needs repair</option><option value="DAMAGED">Damaged</option></select></label><label>Remarks<input value={returnForm.remarks} onChange={(event) => setReturnForm({ ...returnForm, remarks: event.target.value })} /></label><button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Approve return'}</button></form></section>
  </div>;
}
