import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin, showAlert }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object
      const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: formData.email.split('@')[0] || 'Movie Enthusiast',
        email: formData.email,
        joinDate: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${formData.email.split('@')[0]}&background=007bff&color=fff`
      };
      
      // Call the parent login function
      onLogin(user);
      showAlert(`Welcome back, ${user.name}!`, 'success');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      showAlert('Login failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUsers = [
      {
        id: 'demo_user_1',
        name: 'Movie Critic',
        email: 'critic@moviereview.com',
        joinDate: new Date().toISOString(),
        avatar: 'https://ui-avatars.com/api/?name=Movie+Critic&background=28a745&color=fff'
      },
      {
        id: 'demo_user_2',
        name: 'Film Buff',
        email: 'filmbuff@moviereview.com',
        joinDate: new Date().toISOString(),
        avatar: 'https://ui-avatars.com/api/?name=Film+Buff&background=dc3545&color=fff'
      },
      {
        id: 'demo_user_3',
        name: 'Cinema Lover',
        email: 'cinema@moviereview.com',
        joinDate: new Date().toISOString(),
        avatar: 'https://ui-avatars.com/api/?name=Cinema+Lover&background=ffc107&color=000'
      }
    ];
    
    const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    onLogin(randomUser);
    showAlert(`Welcome, ${randomUser.name}! Demo login successful.`, 'success');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <Container fluid className="login-container py-5">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-film-reel">🎬</div>
        <div className="floating-popcorn">🍿</div>
        <div className="floating-clapper">🎭</div>
        <div className="floating-ticket">🎫</div>
      </div>

      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xl={4} lg={5} md={6} sm={8} xs={12}>
          {/* Header Section */}
          <div className="text-center mb-5 animate-fade-in">
            <div className="logo-container mb-4">
              <div className="movie-icon">🎬</div>
            </div>
            <h1 className="display-5 fw-bold text-white mb-3 text-gradient">
              Welcome Back
            </h1>
            <p className="lead text-light opacity-75">
              Sign in to continue your cinematic journey
            </p>
          </div>

          {/* Main Login Card */}
          <Card className="login-card shadow-lg border-0 animate-slide-up">
            <div className="card-glow"></div>
            <Card.Body className="p-4 p-md-5">
              
              {/* Demo Access Section */}
              <div className="demo-section mb-4">
                <div className="text-center mb-3">
                  <span className="badge bg-primary bg-opacity-20 text-primary px-3 py-2 rounded-pill">
                    ✨ Quick Demo Access
                  </span>
                </div>
                <div className="d-grid">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleDemoLogin}
                    className="demo-btn py-3 fw-semibold border-2"
                    disabled={loading}
                  >
                    <span className="demo-icon">🚀</span>
                    Try Demo Account
                    <small className="d-block mt-1 opacity-75 fw-normal">
                      Experience full features instantly
                    </small>
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="divider-section position-relative my-4">
                <div className="divider-line"></div>
                <span className="divider-text bg-white px-3 text-muted small">
                  or continue with email
                </span>
              </div>

              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label fw-semibold text-dark mb-3">
                    📧 Email Address
                  </Form.Label>
                  <div className={`input-group-custom ${focusedField === 'email' ? 'focused' : ''}`}>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      required
                      className="form-control-custom py-3 border-0"
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label fw-semibold text-dark mb-3">
                    🔒 Password
                  </Form.Label>
                  <div className={`input-group-custom ${focusedField === 'password' ? 'focused' : ''}`}>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      required
                      className="form-control-custom py-3 border-0"
                    />
                    <div className="input-focus-border"></div>
                  </div>
                  <Form.Text className="text-muted small mt-2">
                    💡 For demo purposes, any password will work
                  </Form.Text>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                    className="login-btn py-3 fw-bold border-0 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        🎭 Sign In to MovieReview
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              {/* Guest Access */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-3">
                  Want to explore first?
                </p>
                <Link to="/" className="btn btn-outline-dark btn-lg px-4">
                  🎬 Continue as Guest
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Features Card */}
          <Card className="features-card mt-4 border-0 shadow">
            <Card.Body className="p-4">
              <h6 className="fw-bold text-center mb-4 text-primary">
                🎭 Unlock Your Movie Experience
              </h6>
              <Row className="g-3">
                <Col sm={6}>
                  <div className="feature-item d-flex align-items-center">
                    <span className="feature-icon me-3">⭐</span>
                    <span className="feature-text">Rate & Review Movies</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="feature-item d-flex align-items-center">
                    <span className="feature-icon me-3">📝</span>
                    <span className="feature-text">Write Detailed Reviews</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="feature-item d-flex align-items-center">
                    <span className="feature-icon me-3">🔍</span>
                    <span className="feature-text">Discover New Films</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="feature-item d-flex align-items-center">
                    <span className="feature-icon me-3">📊</span>
                    <span className="feature-text">Track Your Activity</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add custom styles */}
      <style jsx>{`
        .login-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-film-reel,
        .floating-popcorn,
        .floating-clapper,
        .floating-ticket {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .floating-film-reel { top: 10%; left: 10%; animation-delay: 0s; }
        .floating-popcorn { top: 20%; right: 15%; animation-delay: 1.5s; }
        .floating-clapper { bottom: 30%; left: 15%; animation-delay: 3s; }
        .floating-ticket { bottom: 20%; right: 10%; animation-delay: 4.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(120, 119, 198, 0.1) 0%, transparent 70%);
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-container {
          display: inline-block;
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .movie-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .text-gradient {
          background: linear-gradient(135deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .input-group-custom {
          position: relative;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2px;
          transition: all 0.3s ease;
        }

        .input-group-custom.focused {
          background: linear-gradient(135deg, #667eea, #764ba2);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .form-control-custom {
          background: #fff;
          border-radius: 10px !important;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          box-shadow: none;
          transform: translateY(-1px);
        }

        .demo-btn, .login-btn {
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .demo-btn:hover, .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .demo-btn:active, .login-btn:active {
          transform: translateY(0);
        }

        .divider-section {
          text-align: center;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #dee2e6, transparent);
          margin: 20px 0;
        }

        .divider-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0 15px;
          color: #6c757d;
          font-weight: 500;
        }

        .feature-item {
          padding: 8px 0;
          transition: transform 0.2s ease;
        }

        .feature-item:hover {
          transform: translateX(5px);
        }

        .feature-icon {
          font-size: 1.2rem;
        }

        .feature-text {
          font-weight: 500;
          color: #495057;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
};

export default Login;