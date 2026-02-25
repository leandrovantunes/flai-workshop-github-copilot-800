import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import octoLogo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container octofit-page mt-4">
      {/* Hero banner */}
      <div className="octofit-hero mb-4">
        <img src={octoLogo} alt="OctoFit Logo" className="octofit-hero-logo" />
        <h1>OctoFit Tracker</h1>
        <p className="lead mt-2">
          Track your fitness activities, join teams, and compete on the leaderboard.
        </p>
        <div className="mt-3">
          <NavLink to="/activities" className="btn btn-danger me-2">Get Started</NavLink>
          <NavLink to="/leaderboard" className="btn btn-outline-light">View Leaderboard</NavLink>
        </div>
      </div>

      {/* Quick-nav cards */}
      <div className="row g-3">
        {[
          { to: '/users',      icon: '👤', title: 'Users',      desc: 'View all registered users' },
          { to: '/teams',      icon: '🏆', title: 'Teams',      desc: 'Browse and manage teams' },
          { to: '/activities', icon: '🏃', title: 'Activities', desc: 'Log and review activities' },
          { to: '/workouts',   icon: '💪', title: 'Workouts',   desc: 'Explore workout plans' },
          { to: '/leaderboard',icon: '📊', title: 'Leaderboard','desc': 'See who is on top' },
        ].map((item) => (
          <div className="col-sm-6 col-lg-4" key={item.to}>
            <NavLink to={item.to} className="text-decoration-none">
              <div className="card octofit-stat-card h-100">
                <div className="card-body">
                  <div className="stat-icon">{item.icon}</div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="stat-value" style={{ fontSize: '0.95rem', color: '#495057' }}>{item.desc}</p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={octoLogo} alt="OctoFit" className="octofit-nav-logo" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-1">
              {[['/', 'Home'], ['/users', 'Users'], ['/teams', 'Teams'],
                ['/activities', 'Activities'], ['/workouts', 'Workouts'], ['/leaderboard', 'Leaderboard']
              ].map(([path, label]) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={path}
                    end={path === '/'}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="octofit-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>

      <footer className="octofit-footer">
        © {new Date().getFullYear()} OctoFit Tracker — Built with React &amp; Django REST Framework
      </footer>
    </Router>
  );
}

export default App;
