import {updateUserRole, getAllUsersEmails} from "../api/auth";
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [email, setEmail] = useState([]);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [updatingRole, setUpdatingRole] = useState(false);
    const [roleForm, setRoleForm] = useState({ email: '', role: '' });




    useEffect(() => {
        async function fetchEmails() {
            try{
                const data = await getAllUsersEmails();
                setEmail(data);
            }catch (e) {
                setError(e.message);
            }
        }
        fetchEmails();
    },[]);

    async function handleRoleChange(event) {
        event.preventDefault();
        if (!roleForm.email.trim()) {
            setNotice('Please enter an email address.');
            return;
        }

        try {
            setUpdatingRole(true);
            await updateUserRole(roleForm.email.trim(), roleForm.role);
            setError('');
            setNotice(`Role updated to ${roleForm.role} for ${roleForm.email.trim()}`);
            setRoleForm({ email: '', role: 'ASSET_ISSUER' });
        } catch (err) {
            setError(err.message);
            setNotice('');
        } finally {
            setUpdatingRole(false);
        }
    }

    return (
        <section className="data-section">
            <h2>Manage User Roles</h2>
            <p className="dashboard-empty">Use this to promote an employee to a different role.</p>
            <form className="role-form" onSubmit={handleRoleChange}>
                <label>
                    Email
                    <select
                        value={roleForm.email}
                        onChange={(event) => setRoleForm({...roleForm, email: event.target.value })} required >
                        <option value=""> Select User</option>
                        {email.map((email) => (
                            <option key={email} value={email}> {email} </option>
                        ))}
                    </select>
                </label>
                <label>
                    Role
                    <select
                        value={roleForm.role}
                        onChange={(event) => setRoleForm({ ...roleForm, role: event.target.value })} required
                    >
                        <option value="">Select Role</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="ASSET_ISSUER">Asset Issuer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="STOCK_MANAGER">Stock Manager</option>
                    </select>
                </label>
                <button className="btn btn-primary" type="submit" disabled={updatingRole}>
                    {updatingRole ? 'Updating...' : 'Update Role'}
                </button>
            </form>
            {notice ? <p className="dashboard-empty">{notice}</p> : null}
        </section>
    );
}