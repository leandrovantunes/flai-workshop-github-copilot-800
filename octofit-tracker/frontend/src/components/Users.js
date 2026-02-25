import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers]   = useState([]);
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Modal state
  const [editUser, setEditUser]     = useState(null);   // user being edited
  const [formData, setFormData]     = useState({});
  const [selectedTeam, setSelectedTeam] = useState(''); // team id string or ''
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiBase = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const apiUrl = `${apiBase}/api/users/`;
  const teamsUrl = `${apiBase}/api/teams/`;

  // Helper – which team (if any) does a user belong to?
  const getUserTeam = useCallback((userName) =>
    teams.find((t) => Array.isArray(t.members) && t.members.includes(userName)) || null,
  [teams]);

  const fetchAll = useCallback(() => {
    console.log('Users: fetching from', apiUrl);
    Promise.all([
      fetch(apiUrl).then((r) => { if (!r.ok) throw new Error(`Users HTTP ${r.status}`); return r.json(); }),
      fetch(teamsUrl).then((r) => { if (!r.ok) throw new Error(`Teams HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([usersData, teamsData]) => {
        console.log('Users: fetched data', usersData);
        console.log('Users: fetched teams', teamsData);
        setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, teamsUrl]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Open the edit modal for a user
  const openEdit = (user) => {
    setSaveError(null);
    setSaveSuccess(false);
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, age: user.age });
    const currentTeam = getUserTeam(user.name);
    setSelectedTeam(currentTeam ? currentTeam.id : '');
  };

  const closeModal = () => { setEditUser(null); setSaveError(null); setSaveSuccess(false); };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      // 1. PATCH user personal details
      const userRes = await fetch(`${apiUrl}${editUser.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, age: Number(formData.age) }),
      });
      if (!userRes.ok) throw new Error(`Failed to update user (HTTP ${userRes.status})`);

      // 2. Update team membership
      const oldTeam = getUserTeam(editUser.name);
      const newTeamId = selectedTeam;

      // Remove from old team if changed
      if (oldTeam && String(oldTeam.id) !== String(newTeamId)) {
        const updatedMembers = oldTeam.members.filter((m) => m !== editUser.name);
        const res = await fetch(`${teamsUrl}${oldTeam.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: updatedMembers }),
        });
        if (!res.ok) throw new Error(`Failed to remove from old team (HTTP ${res.status})`);
      }

      // Add to new team (if selected and different from old)
      if (newTeamId && String(newTeamId) !== String(oldTeam?.id)) {
        const newTeam = teams.find((t) => String(t.id) === String(newTeamId));
        if (newTeam) {
          const memberName = formData.name; // use updated name
          if (!newTeam.members.includes(memberName)) {
            const updatedMembers = [...newTeam.members, memberName];
            const res = await fetch(`${teamsUrl}${newTeam.id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ members: updatedMembers }),
            });
            if (!res.ok) throw new Error(`Failed to add to new team (HTTP ${res.status})`);
          }
        }
      }

      setSaveSuccess(true);
      fetchAll(); // refresh both lists
      setTimeout(closeModal, 900);
    } catch (err) {
      console.error('Users: save error', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-status">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <strong>Error:&nbsp;</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Page heading */}
      <div className="octofit-heading-card">
        <h2>👤 Users</h2>
        <p>{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
      </div>

      {/* Data table */}
      <div className="octofit-table-wrapper">
        <table className="table octofit-table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const team = getUserTeam(user.name);
                return (
                  <tr key={user._id || user.id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-15 text-info-emphasis">
                        {user.age} yrs
                      </span>
                    </td>
                    <td>
                      {team
                        ? <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">{team.name}</span>
                        : <span className="text-muted fst-italic">None</span>}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(user)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0d0d1a, #0f3460)', color: '#fff' }}>
                <h5 className="modal-title fw-bold">✏️ Edit User — {editUser.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal} />
              </div>

              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger py-2">{saveError}</div>
                )}
                {saveSuccess && (
                  <div className="alert alert-success py-2">✅ Saved successfully!</div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    min="1"
                    value={formData.age || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    <option value="">— No team —</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: 'linear-gradient(135deg, #0f3460, #1a4a8a)', border: 'none' }}
                >
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                  ) : '💾 Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
