import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-status">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading teams...</p>
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
        <h2>🏆 Teams</h2>
        <p>{teams.length} team{teams.length !== 1 ? 's' : ''} registered</p>
      </div>

      {/* Data table */}
      <div className="octofit-table-wrapper">
        <table className="table octofit-table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Team Name</th>
              <th>Members</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No teams found.
                </td>
              </tr>
            ) : (
              teams.map((team, index) => {
                const members = Array.isArray(team.members) ? team.members : [];
                return (
                  <tr key={team._id || team.id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td className="fw-semibold">{team.name}</td>
                    <td>
                      {members.length > 0 ? (
                        members.map((m, i) => (
                          <span key={i} className="badge bg-primary bg-opacity-10 text-primary me-1 mb-1">
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No members</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary">{members.length}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
