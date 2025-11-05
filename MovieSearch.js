import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Spinner, Alert, Container, Badge, ButtonGroup } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const MovieSearch = ({ user, showAlert }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState('all'); // 'all', 'movie', 'series'
  const [year, setYear] = useState('');

  // Popular search suggestions
  const popularSearches = [
    'Avengers', 'Star Wars', 'Marvel', 'DC', 'Harry Potter',
    'Lord of the Rings', 'James Bond', 'Fast and Furious',
    'Mission Impossible', 'Pixar', 'Disney', 'Christopher Nolan'
  ];

  // Demo movies data for fallback
  const demoMovies = [
    {
      imdbID: "tt0111161",
      Title: "The Shawshank Redemption",
      Year: "1994",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg"
    },
    {
      imdbID: "tt0068646",
      Title: "The Godfather",
      Year: "1972",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
      imdbID: "tt0468569",
      Title: "The Dark Knight",
      Year: "2008",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg"
    },
    {
      imdbID: "tt0076759",
      Title: "Star Wars: Episode IV - A New Hope",
      Year: "1977",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg"
    },
    {
      imdbID: "tt0109830",
      Title: "Forrest Gump",
      Year: "1994",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
    },
    {
      imdbID: "tt0133093",
      Title: "The Matrix",
      Year: "1999",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
      imdbID: "tt0167260",
      Title: "The Lord of the Rings: The Return of the King",
      Year: "2003",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
      imdbID: "tt1375666",
      Title: "Inception",
      Year: "2010",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
    }
  ];

  // Load search from URL parameters on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(1, urlQuery);
    }
  }, []);

  const handleSearch = async (page = 1, searchQuery = query) => {
    const searchTerm = searchQuery.trim();
    if (!searchTerm) {
      showAlert('Please enter a search term', 'warning');
      return;
    }

    try {
      setLoading(true);
      setCurrentPage(page);

      // Update URL with search parameters
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      if (searchType !== 'all') params.set('type', searchType);
      if (year) params.set('y', year);
      setSearchParams(params);

      // Try to fetch from API
      const response = await axios.get('/api/movies/search', {
        params: {
          query: searchTerm,
          page: page,
          type: searchType !== 'all' ? searchType : undefined,
          y: year || undefined
        }
      });

      if (page === 1) {
        setMovies(response.data.movies || []);
      } else {
        setMovies(prev => [...prev, ...(response.data.movies || [])]);
      }

      setTotalResults(response.data.totalResults || 0);
      setHasSearched(true);
      
      if ((response.data.movies || []).length === 0) {
        showAlert('No movies found. Try different search terms.', 'info');
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      
      // Fallback to demo data
      const filteredDemoMovies = demoMovies.filter(movie => 
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.Year.includes(searchTerm)
      );

      if (page === 1) {
        setMovies(filteredDemoMovies);
      } else {
        setMovies(prev => [...prev, ...filteredDemoMovies]);
      }

      setTotalResults(filteredDemoMovies.length);
      setHasSearched(true);

      if (filteredDemoMovies.length === 0) {
        showAlert('No movies found. Try different search terms.', 'info');
      } else {
        showAlert('Showing demo results. API might be unavailable.', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    handleSearch(currentPage + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setMovies([]);
    handleSearch(1);
  };

  const handlePopularSearch = (popularQuery) => {
    setQuery(popularQuery);
    setCurrentPage(1);
    setMovies([]);
    handleSearch(1, popularQuery);
  };

  const handleClearSearch = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    setTotalResults(0);
    setSearchParams({});
    setSearchType('all');
    setYear('');
  };

  const handleQuickYearSearch = (year) => {
    setYear(year);
    if (query) {
      handleSearch(1);
    }
  };

  const renderStars = (rating) => {
    if (!rating || rating === 'N/A') return null;
    
    const stars = [];
    const numericRating = parseFloat(rating) / 2; // Convert 10-point to 5-point scale
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= numericRating ? 'text-warning' : 'text-muted'}>
          ⭐
        </span>
      );
    }
    return <div className="d-inline">{stars}</div>;
  };

  const canLoadMore = movies.length < totalResults;
  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Container>
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">🔍 Search Movies</h1>
        <p className="lead text-muted">Discover your next favorite movie from thousands of titles</p>
      </div>

      {/* Search Form */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <InputGroup size="lg" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search for movies, series, or actors... (e.g., Avengers, Inception, Titanic)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="py-3"
              />
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !query.trim()}
                className="px-4"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Search'
                )}
              </Button>
            </InputGroup>

            {/* Advanced Search Options */}
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Label className="fw-semibold">Content Type</Form.Label>
                <Form.Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies Only</option>
                  <option value="series">TV Series Only</option>
                </Form.Select>
              </Col>
              
              <Col md={4}>
                <Form.Label className="fw-semibold">Release Year</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 2020"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max={currentYear}
                />
              </Col>

              <Col md={4}>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-grow-1"
                  >
                    {loading ? 'Searching...' : 'Apply Filters'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClearSearch}
                    title="Clear search"
                  >
                    🗑️
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Quick Year Filters */}
      {!hasSearched && (
        <Card className="mb-4">
          <Card.Body>
            <h6 className="fw-semibold mb-3">🎬 Popular Years</h6>
            <div className="d-flex flex-wrap gap-2">
              {recentYears.map(year => (
                <Badge
                  key={year}
                  bg="outline-primary"
                  className="border text-primary cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleQuickYearSearch(year.toString())}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Popular Searches */}
      {!hasSearched && (
        <Card className="mb-4">
          <Card.Body>
            <h6 className="fw-semibold mb-3">🔥 Popular Searches</h6>
            <div className="d-flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Badge
                  key={index}
                  bg="outline-info"
                  className="border text-info cursor-pointer px-3 py-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePopularSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Search Results Header */}
      {hasSearched && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">
              Search Results {totalResults > 0 && `(${totalResults})`}
            </h4>
            <p className="text-muted mb-0">
              {query && `Found ${totalResults} results for "${query}"`}
              {searchType !== 'all' && ` • Type: ${searchType}`}
              {year && ` • Year: ${year}`}
            </p>
          </div>
          {hasSearched && (
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleClearSearch}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && currentPage === 1 && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Searching movies...</span>
        </div>
      )}

      {/* Results Grid */}
      {!loading && hasSearched && (
        <>
          {movies.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>🎭 No movies found</h5>
              <p className="mb-3">We couldn't find any movies matching your search criteria.</p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button variant="primary" onClick={handleClearSearch}>
                  Clear Search
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => handlePopularSearch('Avengers')}
                >
                  Try "Avengers"
                </Button>
              </div>
            </Alert>
          ) : (
            <>
              <Row>
                {movies.map((movie) => (
                  <Col key={movie.imdbID} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100 shadow-sm movie-card">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'}
                          alt={movie.Title}
                          style={{ height: '350px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image';
                          }}
                        />
                        <Badge 
                          bg="dark" 
                          className="position-absolute top-0 end-0 m-2"
                        >
                          {movie.Year}
                        </Badge>
                        {movie.Type && movie.Type !== 'movie' && (
                          <Badge 
                            bg="secondary" 
                            className="position-absolute top-0 start-0 m-2"
                          >
                            {movie.Type}
                          </Badge>
                        )}
                      </div>
                      
                      <Card.Body className="d-flex flex-column">
                        <Card.Title 
                          className="fs-6 fw-bold mb-2" 
                          title={movie.Title}
                          style={{ 
                            minHeight: '48px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {movie.Title}
                        </Card.Title>
                        
                        <div className="mb-2">
                          <small className="text-muted">
                            {movie.Year} • {movie.Type || 'Movie'}
                          </small>
                        </div>

                        {/* Ratings */}
                        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                          <div className="mb-3">
                            <div className="d-flex align-items-center">
                              {renderStars(movie.imdbRating)}
                              <small className="ms-2 text-muted">
                                {movie.imdbRating}/10
                              </small>
                            </div>
                          </div>
                        )}

                        <div className="mt-auto">
                          <Link 
                            to={`/movie/${movie.imdbID}`} 
                            className="text-decoration-none"
                          >
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="w-100"
                            >
                              {user ? 'Review Movie' : 'View Details'}
                            </Button>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Load More Button */}
              {canLoadMore && (
                <div className="text-center mt-4">
                  <Button 
                    onClick={loadMore} 
                    disabled={loading}
                    variant="outline-primary"
                    size="lg"
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading More Movies...
                      </>
                    ) : (
                      `Load More (${movies.length} of ${totalResults})`
                    )}
                  </Button>
                </div>
              )}

              {/* End of Results */}
              {!canLoadMore && movies.length > 0 && (
                <div className="text-center mt-4">
                  <Alert variant="success" className="d-inline-block">
                    <h6 className="mb-0">🎉 All results loaded!</h6>
                    <p className="mb-0">Found {movies.length} movies matching your search.</p>
                  </Alert>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* No Search Yet - Show Featured Movies */}
      {!hasSearched && !loading && (
        <div className="mb-5">
          <h4 className="mb-4">🎭 Featured Movies</h4>
          <Row>
            {demoMovies.slice(0, 8).map((movie) => (
              <Col key={movie.imdbID} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm movie-card">
                  <Card.Img 
                    variant="top" 
                    src={movie.Poster}
                    alt={movie.Title}
                    style={{ height: '350px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 fw-bold mb-2">
                      {movie.Title}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {movie.Year} • {movie.Type}
                    </Card.Text>
                    <Link 
                      to={`/movie/${movie.imdbID}`} 
                      className="mt-auto text-decoration-none"
                    >
                      <Button variant="primary" size="sm" className="w-100">
                        View Details
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Search Tips */}
      {hasSearched && (
        <Card className="mt-5 bg-light border-0">
          <Card.Body>
            <h6 className="fw-semibold mb-3">💡 Search Tips</h6>
            <Row>
              <Col md={6}>
                <ul className="list-unstyled small">
                  <li className="mb-2">✅ Use specific titles for better results</li>
                  <li className="mb-2">✅ Try different spellings if needed</li>
                  <li>✅ Use the year filter for recent releases</li>
                </ul>
              </Col>
              <Col md={6}>
                <ul className="list-unstyled small">
                  <li className="mb-2">✅ Search by actor or director names</li>
                  <li className="mb-2">✅ Use genre keywords (action, comedy, drama)</li>
                  <li>✅ Try popular franchises (Marvel, Star Wars, etc.)</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MovieSearch;