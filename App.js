import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Alert, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Home from './components/Home';
import MovieSearch from './components/MovieSearch';
import MovieDetail from './components/MovieDetail';
import MyReviews from './components/MyReviews';
import UserProfile from './components/UserProfile';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('movieReviewUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleLogin = (userData) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString(),
      reviewCount: 0,
      favoriteGenres: ['Action', 'Drama', 'Comedy']
    };
    
    setUser(userWithTimestamp);
    localStorage.setItem('movieReviewUser', JSON.stringify(userWithTimestamp));
    showAlert(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('movieReviewUser');
    showAlert('Logged out successfully', 'info');
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/" className="fw-bold">
              🎬 MovieReview
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/search">Search Movies</Nav.Link>
                {user && (
                  <>
                    <Nav.Link href="/my-reviews">My Reviews</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav>
                {user ? (
                  <NavDropdown 
                    title={
                      <span>
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="rounded-circle me-2"
                          style={{ width: '30px', height: '30px' }}
                        />
                        {user.name}
                      </span>
                    } 
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item href="/profile">
                      👤 My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/my-reviews">
                      📝 My Reviews
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      🚪 Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link href="/login">Login</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Alert */}
        {alert.show && (
          <Container>
            <Alert 
              variant={alert.type} 
              dismissible 
              onClose={() => setAlert({ show: false, message: '', type: '' })}
              className="mt-3"
            >
              {alert.message}
            </Alert>
          </Container>
        )}

        {/* Main Content */}
        <Container>
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} user={user} />} />
            <Route path="/search" element={<MovieSearch user={user} showAlert={showAlert} />} />
            <Route path="/movie/:id" element={<MovieDetail user={user} showAlert={showAlert} />} />
            <Route path="/my-reviews" element={<MyReviews user={user} showAlert={showAlert} />} />
            <Route path="/profile" element={<UserProfile user={user} showAlert={showAlert} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} showAlert={showAlert} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>

        {/* Footer */}
        <footer className="bg-dark text-light text-center py-4 mt-5">
          <Container>
            <p>&copy; 2024 MovieReview Platform. Built with React & Firebase.</p>
            <p className="mb-0">Data provided by OMDB API</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;