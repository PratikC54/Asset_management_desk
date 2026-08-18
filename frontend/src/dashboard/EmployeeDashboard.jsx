import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getEmployeeDashboardData } from "../api/dashboard";
import { createAssetRequest } from "../api/asset";
import "../styles/Dashboard.css";

function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ issues: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [returning, setReturning] = useState(false);
  const [showAssetRequestForm, setShowAssetRequestForm] = useState(false);
  const [requestingAsset, setRequestingAsset] = useState(false);
  const [assetRequestForm, setAssetRequestForm] = useState({ assetName: '', remarks: '' });
  const [returnForm, setReturnForm] = useState({ issueId: '', remarks: '' });

  async function loadDashboard() {
    if (!user) return;
    try {
      setLoading(true);
      const result = await getEmployeeDashboardData();
      setData({ issues: result.issues || [], requests: result.requests || [] });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, [user?.email]);

  async function handleAssetRequest(event) {
    event.preventDefault();
    try {
      setRequestingAsset(true);
      await createAssetRequest({
        assetName: assetRequestForm.assetName,
        type: 'NEW_REQUEST',
        remarks: assetRequestForm.remarks,
      });
      setAssetRequestForm({ assetName: '', remarks: '' });
      setShowAssetRequestForm(false);
      setNotice('Asset request submitted for manager approval.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setRequestingAsset(false);
    }
  }

  async function handleReturn(event) {
    event.preventDefault();
    try {
      setReturning(true);
      await createAssetRequest({
        assetName: data.issues.find((issue) => issue.id === Number(returnForm.issueId))?.asset || 'Asset',
        type: 'RETURN_REQUEST',
        issueId: Number(returnForm.issueId),
        remarks: returnForm.remarks,
      });
      setNotice('Return request submitted for asset issuer approval.');
      setReturnForm({ issueId: '', remarks: '' });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setReturning(false);
    }
  }

  const returnableIssues = data.issues.filter((issue) => issue.status === 'ISSUED' && !data.requests.some(
    (request) => request.type === 'RETURN_REQUEST' && request.status === 'PENDING' && request.issueId === issue.id,
  ));

  return (
    <div className="role-dashboard">
      <section className="role-dashboard__hero">
        <span className="role-dashboard__badge">Employee workspace</span>
        <h1>Welcome back, {user?.name || "Employee"}</h1>
        <p>Review your assigned assets, keep track of requests, and manage returns from one place.</p>
      </section>

      <section className="role-dashboard__grid">
        <article className="role-dashboard__card">
          <h3>Profile</h3>
          <p className="role-dashboard__meta"><strong>Name:</strong> {user?.name || "—"}</p>
          <p className="role-dashboard__meta"><strong>Email:</strong> {user?.email || "—"}</p>
          <p className="role-dashboard__meta"><strong>Department:</strong> {user?.department || "—"}</p>
        </article>

        <article className="role-dashboard__card">
          <h3>Request Asset</h3>
          <p>Need a new device or accessory?</p>
          <div className="role-dashboard__actions">
            <button type="button" className="role-dashboard__btn role-dashboard__btn--success" onClick={() => setShowAssetRequestForm((visible) => !visible)}>
              Request Asset
            </button>
          </div>
          {showAssetRequestForm ? (
            <form className="role-form" onSubmit={handleAssetRequest}>
              <label>Asset name<input value={assetRequestForm.assetName} onChange={(event) => setAssetRequestForm({ ...assetRequestForm, assetName: event.target.value })} placeholder="e.g. Laptop" required /></label>
              <label>Remarks<input value={assetRequestForm.remarks} onChange={(event) => setAssetRequestForm({ ...assetRequestForm, remarks: event.target.value })} placeholder="Reason for request (optional)" /></label>
              <button type="submit" className="role-dashboard__btn role-dashboard__btn--success" disabled={requestingAsset}>{requestingAsset ? 'Submitting...' : 'Submit Request'}</button>
            </form>
          ) : null}
        </article>

        <article className="role-dashboard__card">
          <h3>Return Asset</h3>
          <p>Submit a return request for an asset you no longer need.</p>
          <form className="role-form" onSubmit={handleReturn}>
            <label>Issued asset<select value={returnForm.issueId} onChange={(event) => setReturnForm({ ...returnForm, issueId: event.target.value })} required><option value="">Select an asset</option>{returnableIssues.map((issue) => <option key={issue.id} value={issue.id}>{issue.asset} (Issue #{issue.id})</option>)}</select></label>
            <label>Remarks<input value={returnForm.remarks} onChange={(event) => setReturnForm({ ...returnForm, remarks: event.target.value })} /></label>
            <button type="submit" className="role-dashboard__btn role-dashboard__btn--danger" disabled={returning}>{returning ? 'Submitting...' : 'Request Return'}</button>
          </form>
        </article>
      </section>
      {notice ? <p className="role-dashboard__empty">{notice}</p> : null}

      <section className="role-dashboard__panel">
        <h3>Issued Assets</h3>
        {loading ? <p className="role-dashboard__empty">Loading assigned assets…</p> : error ? <p className="role-dashboard__empty">{error}</p> : (
          <div className="role-dashboard__table-wrap">
            <table className="role-dashboard__table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Issued On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.issues.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.id}</td>
                    <td>{asset.asset}</td>
                    <td>{asset.date}</td>
                    <td><span className={`role-dashboard__status role-dashboard__status--${asset.status?.toLowerCase() === 'returned' ? 'rejected' : 'in-use'}`}>{asset.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="role-dashboard__panel">
        <h3>Request Tracking</h3>
        {loading ? <p className="role-dashboard__empty">Loading request history…</p> : error ? <p className="role-dashboard__empty">{error}</p> : (
          <div className="role-dashboard__table-wrap">
            <table className="role-dashboard__table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.asset}</td>
                    <td>{request.type}</td>
                    <td><span className={`role-dashboard__status role-dashboard__status--${request.status?.toLowerCase()}`}>{request.status}</span></td>
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

export default EmployeeDashboard;
