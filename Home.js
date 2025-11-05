import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Container, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ showAlert, user }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  useEffect(() => {
    fetchPopularMovies();
    setupFeaturedCategories();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/movies/popular');
      setPopularMovies(response.data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      // Use comprehensive demo data if API fails
      setPopularMovies(getDemoMovies());
      showAlert('Showing demo movies data', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google search
  const handleGoogleSearch = (movieTitle) => {
    const searchQuery = encodeURIComponent(`${movieTitle} movie`);
    const googleUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleUrl, '_blank');
  };

  // Function to handle category Google search
  const handleCategorySearch = (categoryTitle) => {
    const searchQuery = encodeURIComponent(`${categoryTitle} movies`);
    const googleUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleUrl, '_blank');
  };

  const getDemoMovies = () => {
    return [
      {
        imdbID: "tt0111161",
        Title: "The Shawshank Redemption",
        Year: "1994",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
        imdbRating: "9.3",
        Genre: "Drama",
        Director: "Frank Darabont"
      },
      {
        imdbID: "tt0068646",
        Title: "The Godfather",
        Year: "1972",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        imdbRating: "9.2",
        Genre: "Crime, Drama",
        Director: "Francis Ford Coppola"
      },
      {
        imdbID: "tt0468569",
        Title: "The Dark Knight",
        Year: "2008",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
        imdbRating: "9.0",
        Genre: "Action, Crime, Drama",
        Director: "Christopher Nolan"
      },
      {
        imdbID: "tt0076759",
        Title: "Star Wars: Episode IV - A New Hope",
        Year: "1977",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg",
        imdbRating: "8.6",
        Genre: "Action, Adventure, Fantasy",
        Director: "George Lucas"
      },
      {
        imdbID: "tt0109830",
        Title: "Forrest Gump",
        Year: "1994",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        imdbRating: "8.8",
        Genre: "Drama, Romance",
        Director: "Robert Zemeckis"
      },
      {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        imdbRating: "8.7",
        Genre: "Action, Sci-Fi",
        Director: "Lana Wachowski, Lilly Wachowski"
      },
      {
        imdbID: "tt0167260",
        Title: "The Lord of the Rings: The Return of the King",
        Year: "2003",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        imdbRating: "8.9",
        Genre: "Action, Adventure, Drama",
        Director: "Peter Jackson"
      },
      {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        imdbRating: "8.8",
        Genre: "Action, Adventure, Sci-Fi",
        Director: "Christopher Nolan"
      },
      {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        imdbRating: "8.5",
        Genre: "Adventure, Comedy, Sci-Fi",
        Director: "Robert Zemeckis"
      },
      {
        imdbID: "tt0073486",
        Title: "One Flew Over the Cuckoo's Nest",
        Year: "1975",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BZjA0OWVhOTAtYWQxNi00YzNhLWI4ZjYtNjFjZTEyYjJlNDVlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        imdbRating: "8.7",
        Genre: "Drama",
        Director: "Miloš Forman"
      },
      {
        imdbID: "tt0099685",
        Title: "Goodfellas",
        Year: "1990",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        imdbRating: "8.7",
        Genre: "Biography, Crime, Drama",
        Director: "Martin Scorsese"
      },
      {
        imdbID: "tt0137523",
        Title: "Fight Club",
        Year: "1999",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
        imdbRating: "8.8",
        Genre: "Drama",
        Director: "David Fincher"
      },
      {
        imdbID: "tt0110912",
        Title: "Pulp Fiction",
        Year: "1994",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzJjNDymmYzgyZjY@._V1_SX300.jpg",
        imdbRating: "8.9",
        Genre: "Crime, Drama",
        Director: "Quentin Tarantino"
      },
      {
        imdbID: "tt0120737",
        Title: "The Lord of the Rings: The Fellowship of the Ring",
        Year: "2001",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
        imdbRating: "8.8",
        Genre: "Action, Adventure, Drama",
        Director: "Peter Jackson"
      },
      {
        imdbID: "tt0108052",
        Title: "Schindler's List",
        Year: "1993",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        imdbRating: "9.0",
        Genre: "Biography, Drama, History",
        Director: "Steven Spielberg"
      },
      {
        imdbID: "tt0167261",
        Title: "The Lord of the Rings: The Two Towers",
        Year: "2002",
        Type: "movie",
        Poster: "https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtYTM4MjRkYWMxODRmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        imdbRating: "8.8",
        Genre: "Action, Adventure, Drama",
        Director: "Peter Jackson"
      }
    ];
  };

  const setupFeaturedCategories = () => {
    const categories = [
      {
        title: "🏆 Academy Award Winners",
        description: "Best Picture winners that made history",
        movies: getDemoMovies().filter(movie => 
          ["The Godfather", "The Lord of the Rings: The Return of the King", "Schindler's List"].includes(movie.Title)
        )
      },
      {
        title: "🚀 Sci-Fi Classics",
        description: "Mind-bending journeys through space and time",
        movies: getDemoMovies().filter(movie => 
          movie.Genre?.includes("Sci-Fi")
        )
      },
      {
        title: "🎭 Drama Masterpieces",
        description: "Emotional stories that touch the heart",
        movies: getDemoMovies().filter(movie => 
          movie.Genre?.includes("Drama") && !movie.Genre?.includes("Crime") && !movie.Genre?.includes("Action")
        )
      }
    ];
    setFeaturedCategories(categories);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) / 2; // Convert 10-point to 5-point scale
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= numericRating ? 'text-warning' : 'text-muted'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8.5) return 'success';
    if (numRating >= 7.5) return 'warning';
    return 'secondary';
  };

  return (
    <Container>
      {/* Hero Section */}
      <div className="text-center mb-5 py-5 bg-primary text-white rounded hero-section">
        <h1 className="display-4 fw-bold mb-4">
          {user ? `Welcome back, ${user.name}!` : 'Welcome to MovieSearch'}
        </h1>
        <p className="lead mb-4">
          {user 
            ? 'Discover amazing movies and search directly on Google!'
            : 'Find your next favorite movie and get detailed information from Google search!'
          }
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/search">
            <Button variant="light" size="lg" className="fw-semibold">
              🔍 Search Movies
            </Button>
          </Link>
          <Button 
            variant="outline-light" 
            size="lg" 
            className="fw-semibold"
            onClick={() => window.open('https://www.google.com/search?q=popular+movies+2024', '_blank')}
          >
            🌐 Search on Google
          </Button>
          {user && (
            <>
              <Link to="/my-reviews">
                <Button variant="outline-light" size="lg" className="fw-semibold">
                  📝 My Reviews
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* User Welcome Message */}
      {user && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="mb-1">🎉 Welcome to MovieSearch!</h5>
              <p className="mb-0">
                You're logged in as <strong>{user.name}</strong>. Click any movie to search on Google!
              </p>
            </div>
            <Badge bg="light" text="dark" className="fs-6">
              🎬 Movie Explorer
            </Badge>
          </div>
        </Alert>
      )}

      {/* Quick Stats */}
      <Row className="mb-5">
        <Col md={3} className="text-center mb-3">
          <Card className="border-0 bg-light stats-card">
            <Card.Body>
              <h3 className="text-primary mb-1">{popularMovies.length}+</h3>
              <p className="text-muted mb-0">Popular Movies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="text-center mb-3">
          <Card className="border-0 bg-light stats-card">
            <Card.Body>
              <h3 className="text-success mb-1">8.5+</h3>
              <p className="text-muted mb-0">Avg Rating</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="text-center mb-3">
          <Card className="border-0 bg-light stats-card">
            <Card.Body>
              <h3 className="text-warning mb-1">Google</h3>
              <p className="text-muted mb-0">Direct Search</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="text-center mb-3">
          <Card className="border-0 bg-light stats-card">
            <Card.Body>
              <h3 className="text-info mb-1">Instant</h3>
              <p className="text-muted mb-0">Quick Access</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Featured Categories */}
      {featuredCategories.map((category, index) => (
        <div key={index} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-1">{category.title}</h3>
              <p className="text-muted mb-0">{category.description}</p>
            </div>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => handleCategorySearch(category.title)}
              className="category-search-btn"
            >
              🔍 Search on Google
            </Button>
          </div>
          <Row>
            {category.movies.slice(0, 4).map((movie) => (
              <Col key={movie.imdbID} xs={12} sm={6} md={3} className="mb-4">
                <div 
                  className={`movie-card-wrapper ${hoveredMovie === movie.imdbID ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredMovie(movie.imdbID)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  <Card className="h-100 shadow-sm movie-card">
                    <div 
                      className="position-relative movie-poster-container"
                      onClick={() => handleGoogleSearch(movie.Title)}
                    >
                      <Card.Img 
                        variant="top" 
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'}
                        alt={movie.Title}
                        className="movie-poster"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image';
                        }}
                      />
                      <Badge 
                        bg={getRatingColor(movie.imdbRating)}
                        className="position-absolute top-0 end-0 m-2 rating-badge"
                      >
                        {movie.imdbRating}
                      </Badge>
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg="dark" className="google-badge">
                          🔍 Google
                        </Badge>
                      </div>
                      <div className="movie-overlay">
                        <div className="overlay-content">
                          <h6>Quick Info</h6>
                          <p className="small mb-2">{movie.Year}</p>
                          <p className="small mb-3">{movie.Genre?.split(',')[0]}</p>
                          <Button 
                            variant="light" 
                            size="sm"
                            className="overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoogleSearch(movie.Title);
                            }}
                          >
                            🔍 Search Now
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title 
                        className="fs-6 fw-bold movie-title" 
                        title={movie.Title}
                        onClick={() => handleGoogleSearch(movie.Title)}
                      >
                        {movie.Title}
                      </Card.Title>
                      <Card.Text className="text-muted small movie-info">
                        {movie.Year} • {movie.Genre?.split(',')[0]}
                      </Card.Text>
                      <div className="mb-2">
                        {movie.imdbRating && movie.imdbRating !== 'N/A' ? (
                          <div className="d-flex align-items-center">
                            {renderStars(movie.imdbRating)}
                            <small className="ms-2 text-muted">
                              {movie.imdbRating}/10
                            </small>
                          </div>
                        ) : (
                          <div className="text-muted">No rating available</div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-100 movie-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoogleSearch(movie.Title);
                          }}
                        >
                          🔍 Search on Google
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {/* All Popular Movies Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">🎬 All Popular Movies</h2>
            <p className="text-muted mb-0">Click any movie to search directly on Google</p>
          </div>
          <Badge bg="primary" className="fs-6">
            {popularMovies.length} Movies
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="me-2" />
            Loading popular movies...
          </div>
        ) : (
          <Row>
            {popularMovies.map((movie) => (
              <Col key={movie.imdbID} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <div 
                  className={`movie-card-wrapper ${hoveredMovie === movie.imdbID ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredMovie(movie.imdbID)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  <Card 
                    className="h-100 shadow-sm movie-card" 
                    onClick={() => handleGoogleSearch(movie.Title)}
                  >
                    <div className="position-relative movie-poster-container">
                      <Card.Img 
                        variant="top" 
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'}
                        alt={movie.Title}
                        className="movie-poster"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image';
                        }}
                      />
                      <Badge 
                        bg={getRatingColor(movie.imdbRating)}
                        className="position-absolute top-0 end-0 m-2 rating-badge"
                      >
                        {movie.imdbRating}
                      </Badge>
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg="dark" className="google-badge">
                          🔍 Click for Google
                        </Badge>
                      </div>
                      <div className="movie-overlay">
                        <div className="overlay-content">
                          <h6>Quick Info</h6>
                          <p className="small mb-2">{movie.Year}</p>
                          <p className="small mb-3">{movie.Genre?.split(',')[0] || movie.Type}</p>
                          {movie.Director && (
                            <p className="small mb-3">Director: {movie.Director.split(',')[0]}</p>
                          )}
                          <Button 
                            variant="light" 
                            size="sm"
                            className="overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoogleSearch(movie.Title);
                            }}
                          >
                            🔍 Search Now
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title 
                        className="fs-6 fw-bold movie-title" 
                        title={movie.Title}
                        onClick={() => handleGoogleSearch(movie.Title)}
                      >
                        {movie.Title}
                      </Card.Title>
                      <Card.Text className="text-muted small movie-info">
                        {movie.Year} • {movie.Genre?.split(',')[0] || movie.Type}
                      </Card.Text>
                      <div className="mb-2">
                        {movie.imdbRating && movie.imdbRating !== 'N/A' ? (
                          <div className="d-flex align-items-center">
                            {renderStars(movie.imdbRating)}
                            <small className="ms-2 text-muted">
                              {movie.imdbRating}/10
                            </small>
                          </div>
                        ) : (
                          <div className="text-muted">No rating available</div>
                        )}
                      </div>
                      {movie.Director && (
                        <small className="text-muted mb-2 movie-director">
                          Director: {movie.Director.split(',')[0]}
                        </small>
                      )}
                      <div className="mt-auto">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-100 movie-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoogleSearch(movie.Title);
                          }}
                        >
                          🔍 Search on Google
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-dark text-white text-center mb-5 cta-section">
        <Card.Body className="py-5">
          <h3 className="mb-3">Want More Movie Information?</h3>
          <p className="lead mb-4">
            Get trailers, reviews, cast information, and showtimes directly from Google!
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button 
              variant="primary" 
              size="lg" 
              className="fw-semibold cta-btn"
              onClick={() => window.open('https://www.google.com/search?q=latest+movie+trailers', '_blank')}
            >
              🎥 Search Trailers
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              className="fw-semibold cta-btn"
              onClick={() => window.open('https://www.google.com/search?q=upcoming+movies+2024', '_blank')}
            >
              📅 Upcoming Movies
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              className="fw-semibold cta-btn"
              onClick={() => window.open('https://www.google.com/search?q=top+rated+movies+IMDb', '_blank')}
            >
              ⭐ Top Rated
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Custom Styles */}
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          animation: float 20s infinite linear;
        }

        @keyframes float {
          0% { transform: translateX(0px) translateY(0px); }
          100% { transform: translateX(-100px) translateY(-100px); }
        }

        .stats-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .movie-card-wrapper {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .movie-card-wrapper:hover {
          transform: translateY(-10px);
        }

        .movie-card-wrapper.hovered .movie-card {
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border-color: #667eea;
        }

        .movie-card {
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .movie-poster-container {
          overflow: hidden;
          position: relative;
        }

        .movie-poster {
          height: 300px;
          object-fit: cover;
          transition: all 0.5s ease;
        }

        .movie-card-wrapper:hover .movie-poster {
          transform: scale(1.1);
          filter: brightness(0.7);
        }

        .movie-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          transform: translateY(20px);
        }

        .movie-card-wrapper:hover .movie-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .overlay-content {
          text-align: center;
          color: white;
          padding: 20px;
        }

        .overlay-content h6 {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .overlay-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
          color: white;
          transition: all 0.3s ease;
        }

        .overlay-btn:hover {
          background: white;
          color: #667eea;
          transform: scale(1.05);
        }

        .rating-badge {
          font-size: 0.8rem;
          padding: 5px 8px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .movie-card-wrapper:hover .rating-badge {
          transform: scale(1.1);
        }

        .google-badge {
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2) !important;
        }

        .movie-title {
          transition: color 0.3s ease;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .movie-card-wrapper:hover .movie-title {
          color: #667eea;
        }

        .movie-info, .movie-director {
          transition: all 0.3s ease;
        }

        .movie-card-wrapper:hover .movie-info,
        .movie-card-wrapper:hover .movie-director {
          color: #6c757d !important;
        }

        .movie-action-btn {
          transition: all 0.3s ease;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          position: relative;
          overflow: hidden;
        }

        .movie-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .movie-card-wrapper:hover .movie-action-btn::before {
          left: 100%;
        }

        .movie-card-wrapper:hover .movie-action-btn {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .category-search-btn, .cta-btn {
          transition: all 0.3s ease;
          border-radius: 10px;
        }

        .category-search-btn:hover, .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .cta-section {
          border-radius: 20px;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          border: none;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '🎬';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 3rem;
          opacity: 0.1;
        }

        .cta-section::after {
          content: '🍿';
          position: absolute;
          bottom: 20px;
          left: 20px;
          font-size: 3rem;
          opacity: 0.1;
        }
      `}</style>
    </Container>
  );
};

export default Home;