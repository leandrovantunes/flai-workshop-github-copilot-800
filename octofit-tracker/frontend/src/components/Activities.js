import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Activities: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
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
          <p>Loading activities...</p>
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
        <h2>🏃 Activities</h2>
        <p>{activities.length} record{activities.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Data table */}
      <div className="octofit-table-wrapper">
        <table className="table octofit-table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No activities found.
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={activity._id || activity.id || index}>
                  <td className="text-muted">{index + 1}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                      {activity.user}
                    </span>
                  </td>
                  <td>{activity.activity_type}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                      {activity.duration}
                    </span>
                  </td>
                  <td>
                    {(() => {
                      // Parse YYYY-MM-DD without timezone shift
                      const [y, m, d] = activity.date.split('-');
                      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      });
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
