import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert, Button, Container, ProgressBar, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ user, showAlert }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Demo profile data
  const demoProfile = {
    userId: user?.id || 'user_123',
    reviewCount: 8,
    averageRating: 4.2,
    joinDate: new Date('2024-01-01'),
    favoriteGenres: ['Drama', 'Action', 'Sci-Fi', 'Comedy'],
    recentReviews: [
      {
        id: 'review_1',
        movieId: 'tt0111161',
        movieTitle: 'The Shawshank Redemption',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        rating: 5,
        comment: 'An absolute masterpiece!',
        createdAt: new Date('2024-01-15'),
        movieYear: '1994'
      },
      {
        id: 'review_2',
        movieId: 'tt0468569',
        movieTitle: 'The Dark Knight',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        rating: 4,
        comment: 'Heath Ledger was phenomenal!',
        createdAt: new Date('2024-01-10'),
        movieYear: '2008'
      },
      {
        id: 'review_3',
        movieId: 'tt1375666',
        movieTitle: 'Inception',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        rating: 5,
        comment: 'Mind-bending and brilliant!',
        createdAt: new Date('2024-01-05'),
        movieYear: '2010'
      }
    ],
    ratingDistribution: {
      5: 3,
      4: 3,
      3: 1,
      2: 1,
      1: 0
    },
    monthlyActivity: [
      { month: 'Jan 2024', reviews: 5 },
      { month: 'Dec 2023', reviews: 3 },
      { month: 'Nov 2023', reviews: 2 },
      { month: 'Oct 2023', reviews: 1 }
    ],
    topReviewedGenres: [
      { genre: 'Drama', count: 4 },
      { genre: 'Action', count: 3 },
      { genre: 'Sci-Fi', count: 2 },
      { genre: 'Comedy', count: 1 }
    ]
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to demo data
      setProfile(demoProfile);
      showAlert('Using demo profile data', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: 'Movie enthusiast who loves sharing thoughts on films.',
      favoriteGenres: user.favoriteGenres || ['Action', 'Drama', 'Comedy']
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...user,
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio,
        favoriteGenres: editForm.favoriteGenres
      };
      
      // In a real app, you would update the user context and localStorage here
      localStorage.setItem('movieReviewUser', JSON.stringify(updatedUser));
      
      showAlert('Profile updated successfully!', 'success');
      setShowEditModal(false);
      // You would typically refresh the user context here
      window.location.reload(); // Simple refresh for demo
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Error updating profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'text-warning' : 'text-muted'}>
          ⭐
        </span>
      );
    }
    return <div className="d-inline-flex">{stars}</div>;
  };

  const getJoinDuration = () => {
    if (!profile?.joinDate) return 'Recently';
    const joinDate = new Date(profile.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getActivityLevel = () => {
    if (!profile?.reviewCount) return 'Beginner';
    if (profile.reviewCount < 5) return 'Enthusiast';
    if (profile.reviewCount < 15) return 'Critic';
    if (profile.reviewCount < 30) return 'Expert';
    return 'Master';
  };

  const getActivityBadgeVariant = () => {
    const level = getActivityLevel();
    switch (level) {
      case 'Beginner': return 'secondary';
      case 'Enthusiast': return 'info';
      case 'Critic': return 'warning';
      case 'Expert': return 'primary';
      case 'Master': return 'success';
      default: return 'secondary';
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning" className="text-center mt-4">
          <div className="py-4">
            <h4>🔐 Please Log In</h4>
            <p className="mb-3">You need to be logged in to view your profile.</p>
            <Link to="/login">
              <Button variant="primary" size="lg">
                Login to Continue
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          Loading your profile...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">👤 User Profile</h1>
        <p className="lead text-muted">Your movie reviewing journey and statistics</p>
      </div>

      <Row>
        {/* Left Sidebar - Profile Info */}
        <Col md={4}>
          {/* Profile Card */}
          <Card className="text-center shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="mb-3">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <Card.Title className="h4">{user.name}</Card.Title>
              <Card.Text className="text-muted mb-2">{user.email}</Card.Text>
              
              <div className="mb-3">
                <Badge bg={getActivityBadgeVariant()} className="fs-6">
                  🎬 {getActivityLevel()} Reviewer
                </Badge>
              </div>

              <p className="text-muted small mb-3">
                Joined {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                }) : 'Recently'}
              </p>

              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={handleEditProfile}
                >
                  ✏️ Edit Profile
                </Button>
                <Link to="/my-reviews" className="text-decoration-none">
                  <Button variant="primary" className="w-100">
                    📝 My Reviews
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline-secondary" className="w-100">
                    🔍 Search Movies
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h6 className="mb-0">📊 Quick Stats</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <Row>
                  <Col xs={6} className="mb-3">
                    <div className="border-end">
                      <h4 className="text-primary fw-bold mb-1">{profile?.reviewCount || 0}</h4>
                      <small className="text-muted">Reviews</small>
                    </div>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <div>
                      <h4 className="text-warning fw-bold mb-1">{profile?.averageRating?.toFixed(1) || '0.0'}</h4>
                      <small className="text-muted">Avg Rating</small>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <div className="border-end">
                      <h4 className="text-success fw-bold mb-1">{getJoinDuration()}</h4>
                      <small className="text-muted">Active</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h4 className="text-info fw-bold mb-1">{profile?.favoriteGenres?.length || 0}</h4>
                      <small className="text-muted">Favorite Genres</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>

          {/* Favorite Genres */}
          {profile?.favoriteGenres && profile.favoriteGenres.length > 0 && (
            <Card className="shadow-sm">
              <Card.Header>
                <h6 className="mb-0">❤️ Favorite Genres</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                  {profile.favoriteGenres.map((genre, index) => (
                    <Badge 
                      key={index}
                      bg="outline-primary" 
                      className="border text-primary px-2 py-1"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Main Content */}
        <Col md={8}>
          {/* Navigation Tabs */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-0">
              <div className="d-flex border-bottom">
                <button
                  className={`flex-fill btn btn-lg border-0 rounded-0 py-3 ${
                    activeTab === 'overview' 
                      ? 'bg-primary text-white' 
                      : 'bg-light text-dark'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  📈 Overview
                </button>
                <button
                  className={`flex-fill btn btn-lg border-0 rounded-0 py-3 ${
                    activeTab === 'reviews' 
                      ? 'bg-primary text-white' 
                      : 'bg-light text-dark'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  📝 Recent Reviews
                </button>
                <button
                  className={`flex-fill btn btn-lg border-0 rounded-0 py-3 ${
                    activeTab === 'stats' 
                      ? 'bg-primary text-white' 
                      : 'bg-light text-dark'
                  }`}
                  onClick={() => setActiveTab('stats')}
                >
                  📊 Statistics
                </button>
              </div>
            </Card.Body>
          </Card>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              {/* Welcome Card */}
              <Card className="shadow-sm mb-4 border-primary">
                <Card.Body className="text-center py-4">
                  <h4 className="text-primary mb-3">
                    🎉 Welcome back, {user.name}!
                  </h4>
                  <p className="text-muted mb-3">
                    You've been sharing your movie thoughts for {getJoinDuration()}. 
                    Keep up the great work in helping others discover amazing films!
                  </p>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <Badge bg="primary" className="fs-6">
                      {profile?.reviewCount || 0} Reviews Written
                    </Badge>
                    <Badge bg="warning" text="dark" className="fs-6">
                      {profile?.averageRating?.toFixed(1) || '0.0'} Average Rating
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Rating Distribution */}
              {profile?.ratingDistribution && (
                <Card className="shadow-sm mb-4">
                  <Card.Header>
                    <h6 className="mb-0">⭐ Rating Distribution</h6>
                  </Card.Header>
                  <Card.Body>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center" style={{ width: '100px' }}>
                          <span className="fw-semibold me-2">{rating} stars</span>
                          <span className="text-warning">⭐</span>
                        </div>
                        <ProgressBar 
                          now={(profile.ratingDistribution[rating] / profile.reviewCount) * 100} 
                          className="flex-grow-1 mx-3"
                          variant={
                            rating >= 4 ? 'success' : 
                            rating >= 3 ? 'warning' : 'danger'
                          }
                        />
                        <span className="text-muted" style={{ width: '40px' }}>
                          {profile.ratingDistribution[rating] || 0}
                        </span>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Monthly Activity */}
              {profile?.monthlyActivity && (
                <Card className="shadow-sm">
                  <Card.Header>
                    <h6 className="mb-0">📅 Monthly Activity</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {profile.monthlyActivity.map((month, index) => (
                        <Col key={index} xs={6} md={3} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="h5 fw-bold text-primary mb-1">
                              {month.reviews}
                            </div>
                            <small className="text-muted">{month.month}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Your Recent Reviews</h5>
                <Link to="/my-reviews">
                  <Button variant="outline-primary" size="sm">
                    View All Reviews
                  </Button>
                </Link>
              </div>

              {profile?.recentReviews && profile.recentReviews.length > 0 ? (
                <Row>
                  {profile.recentReviews.map((review) => (
                    <Col key={review.id} xs={12} className="mb-3">
                      <Card className="border-0 shadow-sm">
                        <Card.Body>
                          <Row className="g-3 align-items-center">
                            <Col xs={2}>
                              <Link to={`/movie/${review.movieId}`}>
                                <img
                                  src={review.moviePoster || 'https://via.placeholder.com/80x120/333333/FFFFFF?text=No+Image'}
                                  alt={review.movieTitle}
                                  className="img-fluid rounded"
                                  style={{ height: '80px', objectFit: 'cover' }}
                                />
                              </Link>
                            </Col>
                            <Col xs={8}>
                              <Link 
                                to={`/movie/${review.movieId}`}
                                className="text-decoration-none"
                              >
                                <h6 className="mb-1 text-dark">{review.movieTitle}</h6>
                              </Link>
                              <div className="mb-2">
                                <Badge bg="outline-secondary" text="dark" className="border me-2">
                                  {review.movieYear}
                                </Badge>
                                {renderStars(review.rating)}
                                <span className="ms-2 text-warning fw-semibold">
                                  ({review.rating}/5)
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-muted small mb-0" style={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {review.comment}
                                </p>
                              )}
                            </Col>
                            <Col xs={2}>
                              <small className="text-muted">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="text-center py-5">
                  <Card.Body>
                    <h5 className="text-muted mb-3">No reviews yet</h5>
                    <p className="text-muted mb-3">Start sharing your thoughts on movies!</p>
                    <Link to="/search">
                      <Button variant="primary">Browse Movies</Button>
                    </Link>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              {/* Genre Statistics */}
              {profile?.topReviewedGenres && (
                <Card className="shadow-sm mb-4">
                  <Card.Header>
                    <h6 className="mb-0">🎭 Most Reviewed Genres</h6>
                  </Card.Header>
                  <Card.Body>
                    {profile.topReviewedGenres.map((genre, index) => (
                      <div key={index} className="d-flex align-items-center mb-3">
                        <span className="fw-semibold" style={{ width: '120px' }}>
                          {genre.genre}
                        </span>
                        <ProgressBar 
                          now={(genre.count / profile.reviewCount) * 100} 
                          className="flex-grow-1 mx-3"
                          variant={index === 0 ? 'success' : index === 1 ? 'primary' : 'info'}
                        />
                        <span className="text-muted" style={{ width: '40px' }}>
                          {genre.count}
                        </span>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Achievement Stats */}
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="text-center h-100 shadow-sm">
                    <Card.Body>
                      <div className="display-4 text-warning mb-2">⭐</div>
                      <h5>Rating Consistency</h5>
                      <p className="text-muted small">
                        You tend to rate movies {profile?.averageRating && profile.averageRating >= 4 ? 'highly' : 'fairly'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="text-center h-100 shadow-sm">
                    <Card.Body>
                      <div className="display-4 text-success mb-2">📈</div>
                      <h5>Activity Level</h5>
                      <p className="text-muted small">
                        {getActivityLevel()} reviewer with consistent contributions
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Community Impact */}
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">🌍 Community Impact</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col xs={4}>
                      <div className="border-end">
                        <h4 className="text-primary fw-bold mb-1">
                          {Math.floor((profile?.reviewCount || 0) * 2.5)}
                        </h4>
                        <small className="text-muted">Views</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="border-end">
                        <h4 className="text-success fw-bold mb-1">
                          {Math.floor((profile?.reviewCount || 0) * 0.8)}
                        </h4>
                        <small className="text-muted">Helpful Votes</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div>
                        <h4 className="text-info fw-bold mb-1">
                          {Math.floor((profile?.reviewCount || 0) * 1.2)}
                        </h4>
                        <small className="text-muted">Comments</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Tell us about your movie preferences..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Favorite Genres</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Fantasy'].map(genre => (
                  <Badge
                    key={genre}
                    bg={editForm.favoriteGenres?.includes(genre) ? 'primary' : 'outline-primary'}
                    className="border cursor-pointer px-3 py-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const currentGenres = editForm.favoriteGenres || [];
                      const newGenres = currentGenres.includes(genre)
                        ? currentGenres.filter(g => g !== genre)
                        : [...currentGenres, genre];
                      setEditForm({...editForm, favoriteGenres: newGenres});
                    }}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;