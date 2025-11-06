import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Row, Col, Badge, Container, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyReviews = ({ user, showAlert }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [showRateMovieModal, setShowRateMovieModal] = useState(false);
  const [movieToRate, setMovieToRate] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [moviesToRate, setMoviesToRate] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [searchingMovies, setSearchingMovies] = useState(false);
  const [movieSearchResults, setMovieSearchResults] = useState([]);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const navigate = useNavigate();

  // Enhanced demo reviews data
  const demoReviews = [
    {
      id: 'review_1',
      movieId: 'tt0111161',
      movieTitle: 'The Shawshank Redemption',
      moviePoster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
      rating: 5,
      comment: 'An absolute masterpiece! The storytelling is phenomenal and the character development is incredible. One of the best movies ever made.',
      userId: user?.id || 'user_1',
      userName: user?.name || 'Movie Critic',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      movieYear: '1994',
      movieGenre: 'Drama',
      likes: 24,
      isPublic: true
    },
    {
      id: 'review_2',
      movieId: 'tt0468569',
      movieTitle: 'The Dark Knight',
      moviePoster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      rating: 4,
      comment: 'Heath Ledger\'s performance as Joker is legendary. The action sequences are thrilling and the plot keeps you engaged throughout.',
      userId: user?.id || 'user_1',
      userName: user?.name || 'Movie Critic',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      movieYear: '2008',
      movieGenre: 'Action, Crime, Drama',
      likes: 18,
      isPublic: true
    }
  ];

  // Popular movies that user hasn't rated yet
  const unratedMovies = [
    {
      imdbID: 'tt1375666',
      Title: 'Inception',
      Year: '2010',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      Genre: 'Action, Adventure, Sci-Fi',
      Director: 'Christopher Nolan'
    },
    {
      imdbID: 'tt0133093',
      Title: 'The Matrix',
      Year: '1999',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      Genre: 'Action, Sci-Fi',
      Director: 'Lana Wachowski, Lilly Wachowski'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserReviews();
      setupUnratedMovies();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      // Fallback to demo data
      setReviews(demoReviews);
      showAlert('Using demo reviews data', 'info');
    } finally {
      setLoading(false);
    }
  };

  const setupUnratedMovies = () => {
    // Filter out movies that user has already reviewed
    const reviewedMovieIds = reviews.map(review => review.movieId);
    const unrated = unratedMovies.filter(movie => 
      !reviewedMovieIds.includes(movie.imdbID)
    );
    setMoviesToRate(unrated);
  };

  // NEW: Search for movies to rate
  const searchMovies = async (query) => {
    if (!query.trim()) {
      setMovieSearchResults([]);
      return;
    }

    setSearchingMovies(true);
    try {
      // Try to search from OMDB API via backend
      const response = await axios.get(`http://localhost:5000/api/movies/search?query=${encodeURIComponent(query)}`);
      if (response.data.Search) {
        setMovieSearchResults(response.data.Search);
      } else {
        setMovieSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      // Fallback to mock search results
      setMovieSearchResults([
        {
          imdbID: 'tt' + Date.now(),
          Title: query,
          Year: '2023',
          Type: 'movie',
          Poster: 'https://via.placeholder.com/300x450/333333/FFFFFF?text=Movie+Poster'
        }
      ]);
      showAlert('Using demo search results', 'info');
    } finally {
      setSearchingMovies(false);
    }
  };

  // NEW: Open rate movie modal with search
  const openRateMovieModal = (movie = null) => {
    if (movie) {
      setMovieToRate(movie);
      setShowMovieSearch(false);
    } else {
      setMovieToRate(null);
      setShowMovieSearch(true);
      setMovieSearchQuery('');
      setMovieSearchResults([]);
    }
    setNewReview({ rating: 0, comment: '' });
    setShowRateMovieModal(true);
  };

  // NEW: Select movie from search results
  const selectMovieToRate = (movie) => {
    setMovieToRate(movie);
    setShowMovieSearch(false);
    setNewReview({ rating: 0, comment: '' });
  };

  // FIXED: Handle rating a new movie
  const handleRateMovie = async () => {
    if (!movieToRate || newReview.rating === 0) {
      showAlert('Please select a rating before submitting', 'warning');
      return;
    }

    setSubmitting(true);
    
    try {
      const newReviewObj = {
        movieId: movieToRate.imdbID,
        movieTitle: movieToRate.Title,
        rating: newReview.rating,
        comment: newReview.comment,
        userId: user.id,
        userName: user.name
      };

      console.log('Submitting new review:', newReviewObj);

      // Try to submit to API
      const response = await axios.post('http://localhost:5000/api/reviews', newReviewObj);
      
      // If API call succeeds, add the review with the returned ID
      const savedReview = {
        ...newReviewObj,
        id: response.data.id,
        moviePoster: movieToRate.Poster,
        movieYear: movieToRate.Year,
        movieGenre: movieToRate.Genre || 'Unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        isPublic: true
      };

      // Update local state
      setReviews(prev => [savedReview, ...prev]);
      showAlert(`Successfully rated ${movieToRate.Title}!`, 'success');
      
      // Close modal and reset
      setShowRateMovieModal(false);
      setMovieToRate(null);
      setNewReview({ rating: 0, comment: '' });
      setShowMovieSearch(false);
      
      // Update unrated movies list
      setupUnratedMovies();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      
      // Fallback: Add to local state even if API fails
      const fallbackReview = {
        id: `review_${Date.now()}`,
        movieId: movieToRate.imdbID,
        movieTitle: movieToRate.Title,
        moviePoster: movieToRate.Poster || 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Poster',
        rating: newReview.rating,
        comment: newReview.comment,
        userId: user.id,
        userName: user.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        movieYear: movieToRate.Year,
        movieGenre: movieToRate.Genre || 'Unknown',
        likes: 0,
        isPublic: true
      };

      setReviews(prev => [fallbackReview, ...prev]);
      showAlert('Review submitted successfully! (Saved locally)', 'success');
      
      setShowRateMovieModal(false);
      setMovieToRate(null);
      setNewReview({ rating: 0, comment: '' });
      setShowMovieSearch(false);
      setupUnratedMovies();
    } finally {
      setSubmitting(false);
    }
  };

  // FIXED: Handle updating an existing review
  const handleUpdateReview = async (reviewId, updatedData) => {
    setSubmitting(true);
    
    try {
      console.log('Updating review:', reviewId, updatedData);

      // Try to update via API
      await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, {
        ...updatedData,
        userId: user.id
      });

      // Update local state
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                ...updatedData, 
                updatedAt: new Date(),
                isUpdated: true
              }
            : review
        )
      );
      
      showAlert('Review updated successfully!', 'success');
      setEditingReview(null);
      setEditForm({ rating: 5, comment: '' });
      
    } catch (error) {
      console.error('Error updating review:', error);
      
      // Fallback: Update local state even if API fails
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                ...updatedData, 
                updatedAt: new Date(),
                isUpdated: true
              }
            : review
        )
      );
      
      showAlert('Review updated successfully! (Saved locally)', 'success');
      setEditingReview(null);
      setEditForm({ rating: 5, comment: '' });
    } finally {
      setSubmitting(false);
    }
  };

  // FIXED: Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    setSubmitting(true);
    
    try {
      console.log('Deleting review:', reviewId);

      // Try to delete via API
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);

      // Update local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      showAlert('Review deleted successfully!', 'success');
      
    } catch (error) {
      console.error('Error deleting review:', error);
      
      // Fallback: Update local state even if API fails
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      showAlert('Review deleted successfully! (Removed locally)', 'success');
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesSearch = review.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'high-rated' && review.rating >= 4) ||
        (filter === 'low-rated' && review.rating <= 2) ||
        (filter === 'recent' && isRecent(review.createdAt));
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const isRecent = (date) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(date) > sevenDaysAgo;
  };

  const startEditReview = (review) => {
    setEditingReview(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
    setHoverRating(0);
  };

  const confirmDelete = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null, size = 'medium') => {
    const stars = [];
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
    const sizeClass = {
      small: '1.2rem',
      medium: '1.5rem',
      large: '2rem',
      xlarge: '2.5rem'
    }[size];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= displayRating ? 'filled' : 'empty'} ${
            interactive ? 'interactive' : ''
          }`}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fontSize: sizeClass,
            marginRight: '4px',
            transition: 'all 0.2s ease',
            filter: i <= displayRating ? 'drop-shadow(0 2px 4px rgba(255,193,7,0.3))' : 'none',
            transform: i <= displayRating ? 'scale(1.1)' : 'scale(1)'
          }}
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          {i <= displayRating ? '⭐' : '☆'}
        </span>
      );
    }
    return <div className="d-inline-flex align-items-center">{stars}</div>;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    if (rating >= 2.5) return 'info';
    return 'danger';
  };

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Masterpiece';
    if (rating === 4) return 'Great';
    if (rating === 3) return 'Good';
    if (rating === 2) return 'Fair';
    return 'Poor';
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning" className="text-center mt-4">
          <div className="py-4">
            <h4>🔐 Please Log In</h4>
            <p className="mb-3">You need to be logged in to view and manage your reviews.</p>
            <Link to="/login">
              <Button variant="primary" size="lg" className="me-2">
                Login to Continue
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">📝 My Reviews</h1>
        <p className="lead text-muted">Manage and view all your movie reviews</p>
        
        {/* Rate New Movies Section */}
        <Card className="mb-4 border-0 rate-new-movies-card">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h4 className="mb-2">🎬 Rate Any Movie</h4>
                <p className="text-muted mb-0">
                  Search and rate any movie from our extensive database
                </p>
              </Col>
              <Col md={4} className="text-end">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => openRateMovieModal()}
                  className="rate-movies-btn"
                >
                  🔍 Search & Rate Movies
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label className="fw-semibold">🔍 Search Reviews</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by movie title or review content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">🎯 Filter by</Form.Label>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reviews</option>
                <option value="recent">Recent Reviews</option>
                <option value="high-rated">High Rated (4-5 stars)</option>
                <option value="low-rated">Low Rated (1-2 stars)</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">📊 Sort by</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  onClick={() => openRateMovieModal()}
                >
                  🔍 Rate Movie
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          Loading your reviews...
        </div>
      ) : filteredAndSortedReviews.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="py-4">
              <div className="mb-3">📝</div>
              <h4 className="text-muted mb-3">
                {searchTerm || filter !== 'all' ? 'No matching reviews found' : 'No reviews yet'}
              </h4>
              <p className="text-muted mb-4">
                Start building your movie review collection by rating your favorite films!
              </p>
              <Button 
                variant="primary" 
                onClick={() => openRateMovieModal()}
                size="lg"
              >
                🔍 Search & Rate Your First Movie
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted">
              Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
            </span>
            <Button 
              variant="success" 
              size="sm"
              onClick={() => openRateMovieModal()}
            >
              + Add New Review
            </Button>
          </div>

          {/* Reviews List */}
          <Row>
            {filteredAndSortedReviews.map((review) => (
              <Col key={review.id} xs={12} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      {/* Movie Poster */}
                      <Col xs={12} md={2}>
                        <Link to={`/movie/${review.movieId}`}>
                          <Card.Img
                            variant="top"
                            src={review.moviePoster || 'https://via.placeholder.com/200x300/333333/FFFFFF?text=No+Image'}
                            alt={review.movieTitle}
                            className="movie-poster"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x300/333333/FFFFFF?text=No+Image';
                            }}
                          />
                        </Link>
                      </Col>

                      {/* Review Content */}
                      <Col xs={12} md={8}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <Link 
                              to={`/movie/${review.movieId}`}
                              className="text-decoration-none"
                            >
                              <h4 className="mb-2">{review.movieTitle}</h4>
                            </Link>
                            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                              <Badge bg="outline-secondary" text="dark" className="border">
                                {review.movieYear}
                              </Badge>
                              {review.movieGenre && (
                                <Badge bg="outline-info" text="dark" className="border">
                                  {review.movieGenre.split(',')[0]}
                                </Badge>
                              )}
                              {review.isUpdated && (
                                <Badge bg="warning" text="dark">
                                  ✏️ Edited
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="rating-display text-end">
                            <Badge bg={getRatingColor(review.rating)}>
                              {review.rating}/5
                            </Badge>
                            <div className="rating-label small text-muted mt-1">
                              {getRatingLabel(review.rating)}
                            </div>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="mb-4">
                          {renderStars(review.rating, false, null, 'large')}
                        </div>

                        {/* Review Comment */}
                        {editingReview === review.id ? (
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Edit Your Review</Form.Label>
                            <div className="mb-4">
                              <Form.Label>Your Rating: {editForm.rating} stars</Form.Label>
                              <div className="rating-editor">
                                {renderStars(editForm.rating, true, (rating) => 
                                  setEditForm({...editForm, rating})
                                )}
                              </div>
                            </div>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={editForm.comment}
                              onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                              placeholder="Share your thoughts about this movie..."
                            />
                            <div className="d-flex gap-2 mt-3">
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleUpdateReview(review.id, editForm)}
                                disabled={submitting}
                              >
                                {submitting ? 'Saving...' : '💾 Save Changes'}
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={cancelEdit}
                                disabled={submitting}
                              >
                                ↩️ Cancel
                              </Button>
                            </div>
                          </Form.Group>
                        ) : (
                          <>
                            {review.comment && (
                              <div className="review-comment">
                                <p className="text-dark mb-3" style={{ lineHeight: '1.6' }}>
                                  {review.comment}
                                </p>
                              </div>
                            )}
                            <div className="review-meta">
                              <small className="text-muted">
                                Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                                {review.updatedAt && review.updatedAt !== review.createdAt && (
                                  <span> • Updated on {new Date(review.updatedAt).toLocaleDateString()}</span>
                                )}
                              </small>
                            </div>
                          </>
                        )}
                      </Col>

                      {/* Actions */}
                      <Col xs={12} md={2}>
                        <div className="action-buttons">
                          <Link to={`/movie/${review.movieId}`}>
                            <Button variant="outline-primary" size="sm" className="w-100 mb-2">
                              🎬 View Movie
                            </Button>
                          </Link>
                          {editingReview !== review.id && (
                            <>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="w-100 mb-2"
                                onClick={() => startEditReview(review)}
                              >
                                ✏️ Edit Review
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="w-100"
                                onClick={() => confirmDelete(review)}
                              >
                                🗑️ Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Enhanced Rate Movie Modal with Search */}
      <Modal show={showRateMovieModal} onHide={() => setShowRateMovieModal(false)} centered size="lg" className="rate-movie-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            {showMovieSearch ? '🔍 Search Movie to Rate' : '⭐ Rate a Movie'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {showMovieSearch ? (
            <div className="movie-search-section">
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Search for a Movie</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Enter movie title (e.g., Avengers, Titanic, Inception)..."
                    value={movieSearchQuery}
                    onChange={(e) => {
                      setMovieSearchQuery(e.target.value);
                      searchMovies(e.target.value);
                    }}
                    className="search-input"
                  />
                  <Button 
                    variant="primary"
                    onClick={() => searchMovies(movieSearchQuery)}
                    disabled={searchingMovies}
                  >
                    {searchingMovies ? <Spinner size="sm" /> : '🔍'}
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  Search any movie from our database to rate and review
                </Form.Text>
              </Form.Group>

              {searchingMovies && (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <p className="mt-2 text-muted">Searching for movies...</p>
                </div>
              )}

              {movieSearchResults.length > 0 && (
                <div className="search-results">
                  <h6 className="mb-3">Search Results ({movieSearchResults.length} found)</h6>
                  <div className="row g-3">
                    {movieSearchResults.map((movie) => (
                      <div key={movie.imdbID} className="col-12">
                        <Card 
                          className="search-result-card"
                          onClick={() => selectMovieToRate(movie)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="p-3">
                            <Row className="align-items-center">
                              <Col xs={3}>
                                <img
                                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/80x120/333333/FFFFFF?text=No+Poster'}
                                  alt={movie.Title}
                                  className="search-poster"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x120/333333/FFFFFF?text=No+Poster';
                                  }}
                                />
                              </Col>
                              <Col xs={9}>
                                <h6 className="mb-1">{movie.Title}</h6>
                                <p className="text-muted mb-1 small">{movie.Year} • {movie.Type}</p>
                                <Badge bg="outline-primary" className="select-badge">
                                  Click to Select
                                </Badge>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movieSearchQuery && !searchingMovies && movieSearchResults.length === 0 && (
                <div className="text-center py-4">
                  <div className="mb-3">🎬</div>
                  <h6>No movies found</h6>
                  <p className="text-muted">Try searching with a different title</p>
                </div>
              )}

              <div className="text-center mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setShowMovieSearch(false);
                    setMovieToRate(moviesToRate[0] || null);
                  }}
                >
                  ← Back to Suggested Movies
                </Button>
              </div>
            </div>
          ) : movieToRate ? (
            <div className="rate-movie-content">
              <Row className="g-4">
                <Col md={4}>
                  <Card.Img
                    variant="top"
                    src={movieToRate.Poster || 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'}
                    alt={movieToRate.Title}
                    className="movie-poster-rate"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image';
                    }}
                  />
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="mb-2">{movieToRate.Title}</h4>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setShowMovieSearch(true)}
                    >
                      🔍 Change Movie
                    </Button>
                  </div>
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <Badge bg="outline-secondary" text="dark" className="border">
                      {movieToRate.Year}
                    </Badge>
                    {movieToRate.Genre && (
                      <Badge bg="outline-info" text="dark" className="border">
                        {movieToRate.Genre.split(',')[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Your Rating</Form.Label>
                    <div className="rating-section mb-3">
                      {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}), 'xlarge')}
                      {newReview.rating > 0 && (
                        <div className="rating-feedback mt-2">
                          <Badge bg={getRatingColor(newReview.rating)} className="fs-6">
                            {newReview.rating}/5 - {getRatingLabel(newReview.rating)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Your Review (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      placeholder="Share your thoughts about this movie... What did you like or dislike?"
                      className="review-textarea"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      onClick={handleRateMovie}
                      disabled={newReview.rating === 0 || submitting}
                      className="submit-review-btn"
                    >
                      {submitting ? 'Submitting...' : '💾 Submit Review'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowRateMovieModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mb-3">🎬</div>
              <h5>Select a Movie to Rate</h5>
              <p className="text-muted mb-4">Choose from suggested movies or search for any movie</p>
              <div className="d-flex gap-2 justify-content-center">
                <Button 
                  variant="primary" 
                  onClick={() => setShowMovieSearch(true)}
                >
                  🔍 Search Any Movie
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={() => setMovieToRate(moviesToRate[0] || null)}
                >
                  🎬 Suggested Movies
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🗑️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">⚠️</div>
          <p>Are you sure you want to delete your review for:</p>
          <h5 className="text-danger mb-3 fw-bold">
            "{reviewToDelete?.movieTitle}"
          </h5>
          <p className="text-muted">
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteReview(reviewToDelete?.id)}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : '🗑️ Delete Review'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .movie-poster {
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .movie-poster-rate {
          width: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .search-poster {
          width: 80px;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
        }

        .rating-section {
          text-align: center;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 10px;
        }

        .rating-editor {
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 10px;
        }

        .review-comment {
          background: rgba(102, 126, 234, 0.03);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .rate-new-movies-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
        }

        .search-result-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .search-result-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .select-badge {
          border: 1px solid #667eea;
          color: #667eea;
          font-size: 0.7rem;
          padding: 2px 8px;
        }

        .search-input {
          border-radius: 8px 0 0 8px;
        }

        .rate-movie-modal .modal-content {
          border-radius: 15px;
        }

        .submit-review-btn {
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>
    </Container>
  );
};

export default MyReviews; 