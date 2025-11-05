import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert, Spinner, Badge, ListGroup, Container } from 'react-bootstrap';
import axios from 'axios';

const MovieDetail = ({ user, showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchReviews();
      fetchMovieStats();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      showAlert('Error loading movie details', 'danger');
      // Load demo data if API fails
      loadDemoMovieData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoMovieData = () => {
    const demoMovies = {
      "tt0111161": {
        Title: "The Shawshank Redemption",
        Year: "1994",
        Rated: "R",
        Released: "14 Oct 1994",
        Runtime: "142 min",
        Genre: "Drama",
        Director: "Frank Darabont",
        Writer: "Stephen King, Frank Darabont",
        Actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
        Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        Language: "English",
        Country: "USA",
        Awards: "Nominated for 7 Oscars. 21 wins & 36 nominations total",
        Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
        Ratings: [
          { Source: "Internet Movie Database", Value: "9.3/10" },
          { Source: "Rotten Tomatoes", Value: "91%" },
          { Source: "Metacritic", Value: "80/100" }
        ],
        Metascore: "80",
        imdbRating: "9.3",
        imdbVotes: "2,845,998",
        imdbID: "tt0111161",
        Type: "movie",
        DVD: "N/A",
        BoxOffice: "$28,767,189",
        Production: "N/A",
        Website: "N/A"
      },
      "tt0068646": {
        Title: "The Godfather",
        Year: "1972",
        Rated: "R",
        Released: "24 Mar 1972",
        Runtime: "175 min",
        Genre: "Crime, Drama",
        Director: "Francis Ford Coppola",
        Writer: "Mario Puzo, Francis Ford Coppola",
        Actors: "Marlon Brando, Al Pacino, James Caan",
        Plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        Language: "English, Italian, Latin",
        Country: "USA",
        Awards: "Won 3 Oscars. 26 wins & 30 nominations total",
        Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        Ratings: [
          { Source: "Internet Movie Database", Value: "9.2/10" },
          { Source: "Rotten Tomatoes", Value: "97%" },
          { Source: "Metacritic", Value: "100/100" }
        ],
        Metascore: "100",
        imdbRating: "9.2",
        imdbVotes: "1,954,569",
        imdbID: "tt0068646",
        Type: "movie",
        DVD: "N/A",
        BoxOffice: "$136,381,073",
        Production: "N/A",
        Website: "N/A"
      },
      "tt0468569": {
        Title: "The Dark Knight",
        Year: "2008",
        Rated: "PG-13",
        Released: "18 Jul 2008",
        Runtime: "152 min",
        Genre: "Action, Crime, Drama",
        Director: "Christopher Nolan",
        Writer: "Jonathan Nolan, Christopher Nolan, David S. Goyer",
        Actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
        Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        Language: "English, Mandarin",
        Country: "USA, UK",
        Awards: "Won 2 Oscars. 159 wins & 163 nominations total",
        Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
        Ratings: [
          { Source: "Internet Movie Database", Value: "9.0/10" },
          { Source: "Rotten Tomatoes", Value: "94%" },
          { Source: "Metacritic", Value: "84/100" }
        ],
        Metascore: "84",
        imdbRating: "9.0",
        imdbVotes: "2,756,158",
        imdbID: "tt0468569",
        Type: "movie",
        DVD: "N/A",
        BoxOffice: "$534,987,076",
        Production: "N/A",
        Website: "N/A"
      }
    };

    const demoMovie = demoMovies[id];
    if (demoMovie) {
      setMovie(demoMovie);
    } else {
      showAlert('Movie not found', 'danger');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/movie/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Load demo reviews if API fails
      loadDemoReviews();
    }
  };

  const loadDemoReviews = () => {
    const demoReviews = [
      {
        id: 'review_1',
        movieId: id,
        movieTitle: movie?.Title || 'Demo Movie',
        rating: 5,
        comment: 'Absolutely fantastic movie! The acting was superb and the storyline kept me engaged throughout.',
        userId: 'user_1',
        userName: 'Movie Critic',
        createdAt: new Date('2024-01-15'),
        userAvatar: 'https://ui-avatars.com/api/?name=Movie+Critic&background=28a745&color=fff'
      },
      {
        id: 'review_2',
        movieId: id,
        movieTitle: movie?.Title || 'Demo Movie',
        rating: 4,
        comment: 'Great film with amazing cinematography. Some parts felt a bit slow, but overall very enjoyable.',
        userId: 'user_2',
        userName: 'Film Enthusiast',
        createdAt: new Date('2024-01-10'),
        userAvatar: 'https://ui-avatars.com/api/?name=Film+Enthusiast&background=007bff&color=fff'
      },
      {
        id: 'review_3',
        movieId: id,
        movieTitle: movie?.Title || 'Demo Movie',
        rating: 3,
        comment: 'Good movie but not as great as everyone says. Worth watching once.',
        userId: 'user_3',
        userName: 'Casual Viewer',
        createdAt: new Date('2024-01-05'),
        userAvatar: 'https://ui-avatars.com/api/?name=Casual+Viewer&background=6c757d&color=fff'
      }
    ];
    setReviews(demoReviews);
  };

  const fetchMovieStats = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching movie stats:', error);
      // Load demo stats
      setStats({
        averageRating: 4.0,
        reviewCount: 3,
        ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 }
      });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showAlert('Please log in to submit a review', 'warning');
      navigate('/login');
      return;
    }

    try {
      setReviewLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview = {
        id: `review_${Date.now()}`,
        movieId: id,
        movieTitle: movie?.Title,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        createdAt: new Date()
      };

      // Add to reviews list
      setReviews(prev => [newReview, ...prev]);
      
      // Update stats
      setStats(prev => ({
        averageRating: ((prev.averageRating * prev.reviewCount) + reviewForm.rating) / (prev.reviewCount + 1),
        reviewCount: prev.reviewCount + 1,
        ratingDistribution: {
          ...prev.ratingDistribution,
          [reviewForm.rating]: (prev.ratingDistribution[reviewForm.rating] || 0) + 1
        }
      }));

      showAlert('Review submitted successfully!', 'success');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      showAlert('Error submitting review', 'danger');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, ...updatedData, updatedAt: new Date() }
            : review
        )
      );
      
      showAlert('Review updated successfully!', 'success');
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error updating review:', error);
      showAlert('Error updating review', 'danger');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const reviewToDelete = reviews.find(r => r.id === reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Update stats
      if (stats && reviewToDelete) {
        const newReviewCount = stats.reviewCount - 1;
        const newAverage = newReviewCount > 0 
          ? ((stats.averageRating * stats.reviewCount) - reviewToDelete.rating) / newReviewCount
          : 0;
        
        setStats(prev => ({
          averageRating: newAverage,
          reviewCount: newReviewCount,
          ratingDistribution: {
            ...prev.ratingDistribution,
            [reviewToDelete.rating]: Math.max(0, (prev.ratingDistribution[reviewToDelete.rating] || 0) - 1)
          }
        }));
      }

      showAlert('Review deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting review:', error);
      showAlert('Error deleting review', 'danger');
    }
  };

  const startEditReview = (review) => {
    setReviewForm({
      rating: review.rating,
      comment: review.comment
    });
    setEditingReview(review.id);
    setShowReviewForm(true);
  };

  const cancelEdit = () => {
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const userReview = reviews.find(review => review.userId === user?.id);

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'text-warning' : 'text-muted'} ${
            interactive ? 'interactive' : ''
          }`}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fontSize: interactive ? '2rem' : '1.2rem',
            marginRight: '2px'
          }}
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
        >
          ⭐
        </span>
      );
    }
    return <div>{stars}</div>;
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <div className="mt-3">
        <h6>Rating Distribution:</h6>
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="d-flex align-items-center mb-2">
            <small className="me-2" style={{ width: '20px' }}>{rating}⭐</small>
            <div className="progress flex-grow-1" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-warning" 
                style={{ 
                  width: `${(stats.ratingDistribution[rating] / stats.reviewCount) * 100}%` 
                }}
              />
            </div>
            <small className="ms-2 text-muted" style={{ width: '30px' }}>
              {stats.ratingDistribution[rating] || 0}
            </small>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          Loading movie details...
        </div>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert variant="danger" className="text-center">
          <h4>Movie not found</h4>
          <p>The movie you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/search')}>
            Back to Search
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Back Button */}
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        ← Back
      </Button>

      {/* Movie Header */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow">
            <Card.Img 
              variant="top" 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'}
              alt={movie.Title}
              style={{ height: '500px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image';
              }}
            />
          </Card>
        </Col>
        
        <Col md={8}>
          <div className="ps-md-4">
            <h1 className="display-5 fw-bold mb-3">{movie.Title}</h1>
            <p className="lead text-muted mb-4">{movie.Plot}</p>
            
            <div className="mb-4">
              <Badge bg="primary" className="me-2 fs-6">{movie.Year}</Badge>
              <Badge bg="secondary" className="me-2 fs-6">{movie.Rated}</Badge>
              <Badge bg="info" className="me-2 fs-6">{movie.Runtime}</Badge>
              <Badge bg="success" className="me-2 fs-6">{movie.Genre}</Badge>
            </div>

            <Row className="mb-4">
              <Col sm={6}>
                <strong>Director:</strong> 
                <p className="text-muted">{movie.Director}</p>
              </Col>
              <Col sm={6}>
                <strong>Actors:</strong>
                <p className="text-muted">{movie.Actors}</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={6}>
                <strong>Writer:</strong>
                <p className="text-muted">{movie.Writer}</p>
              </Col>
              <Col sm={6}>
                <strong>Language:</strong>
                <p className="text-muted">{movie.Language}</p>
              </Col>
            </Row>

            {/* Ratings */}
            <Card className="mb-4">
              <Card.Body>
                <h5>Ratings</h5>
                <Row>
                  <Col md={6}>
                    <div className="text-center p-3">
                      <div className="display-4 fw-bold text-warning mb-2">
                        {movie.imdbRating}/10
                      </div>
                      <div className="mb-2">
                        {renderStars(movie.imdbRating / 2)}
                      </div>
                      <small className="text-muted">
                        IMDb ({movie.imdbVotes} votes)
                      </small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3">
                      {movie.Ratings && movie.Ratings.map((rating, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span className="fw-semibold">{rating.Source}:</span>
                          <span className="text-muted">{rating.Value}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Community Stats */}
            {stats && (
              <Card className="mb-4">
                <Card.Body>
                  <h5>Community Reviews</h5>
                  <Row>
                    <Col md={6}>
                      <div className="text-center">
                        <div className="display-4 fw-bold text-primary mb-2">
                          {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="mb-2">
                          {renderStars(Math.round(stats.averageRating))}
                        </div>
                        <small className="text-muted">
                          Average Rating ({stats.reviewCount} reviews)
                        </small>
                      </div>
                    </Col>
                    <Col md={6}>
                      {renderRatingDistribution()}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3 flex-wrap">
              {user && !userReview && !editingReview && (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowReviewForm(true)}
                >
                  ✍️ Write a Review
                </Button>
              )}
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/search')}
              >
                🔍 Search More Movies
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Review Form */}
      {(showReviewForm || editingReview) && (
        <Card className="mb-4 border-primary">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              {editingReview ? 'Edit Your Review' : 'Write Your Review'}
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Your Rating</Form.Label>
                <div className="d-flex align-items-center">
                  {renderStars(
                    reviewForm.rating, 
                    true, 
                    (rating) => setReviewForm({...reviewForm, rating})
                  )}
                  <span className="ms-3 fs-5 fw-bold text-warning">
                    ({reviewForm.rating}/5)
                  </span>
                </div>
              </div>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Share your thoughts about this movie... What did you like? What could be better?"
                  style={{ resize: 'vertical' }}
                />
                <Form.Text className="text-muted">
                  Your review helps other movie lovers discover great films!
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={reviewLoading}
                  className="px-4"
                >
                  {reviewLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {editingReview ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    editingReview ? 'Update Review' : 'Submit Review'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline-secondary"
                  onClick={cancelEdit}
                  disabled={reviewLoading}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* User's Existing Review */}
      {userReview && !editingReview && (
        <Card className="mb-4 border-warning">
          <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Review</h5>
            <div className="d-flex gap-2">
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => startEditReview(userReview)}
              >
                ✏️ Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteReview(userReview.id)}
              >
                🗑️ Delete
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="d-flex align-items-start">
              <img 
                src={userReview.userAvatar || user?.avatar} 
                alt={userReview.userName}
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px' }}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">{userReview.userName}</strong>
                  {renderStars(userReview.rating)}
                  <span className="ms-2 text-warning fw-bold">({userReview.rating}/5)</span>
                </div>
                {userReview.comment && (
                  <p className="mb-3 fs-6">{userReview.comment}</p>
                )}
                <small className="text-muted">
                  Reviewed on {new Date(userReview.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {userReview.updatedAt && userReview.updatedAt !== userReview.createdAt && (
                    <span> • Updated on {new Date(userReview.updatedAt).toLocaleDateString()}</span>
                  )}
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Community Reviews */}
      <Card>
        <Card.Header>
          <h4 className="mb-0">
            🗣️ Community Reviews 
            <Badge bg="primary" className="ms-2 fs-6">
              {reviews.filter(r => !user || r.userId !== user.id).length}
            </Badge>
          </h4>
        </Card.Header>
        <Card.Body>
          {reviews.filter(r => !user || r.userId !== user.id).length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No community reviews yet</h5>
              <p>Be the first to share your thoughts about this movie!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {reviews
                .filter(review => !user || review.userId !== user.id)
                .map((review) => (
                <ListGroup.Item key={review.id} className="px-0 py-4 border-bottom">
                  <div className="d-flex align-items-start">
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="rounded-circle me-3"
                      style={{ width: '45px', height: '45px' }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 fw-semibold">{review.userName}</h6>
                          <div className="d-flex align-items-center">
                            {renderStars(review.rating)}
                            <span className="ms-2 text-warning fw-semibold">({review.rating}/5)</span>
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                      {review.comment && (
                        <p className="mb-2 text-dark">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieDetail;