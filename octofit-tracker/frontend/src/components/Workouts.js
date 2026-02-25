import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
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
          <p>Loading workouts...</p>
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
        <h2>💪 Workouts</h2>
        <p>{workouts.length} workout plan{workouts.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Data table */}
      <div className="octofit-table-wrapper">
        <table className="table octofit-table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Workout Name</th>
              <th>Description</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No workouts found.
                </td>
              </tr>
            ) : (
              workouts.map((workout, index) => (
                <tr key={workout._id || workout.id || index}>
                  <td className="text-muted">{index + 1}</td>
                  <td className="fw-semibold">{workout.name}</td>
                  <td className="text-muted">{workout.description}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                      {workout.duration}
                    </span>
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

export default Workouts;
