import axios from 'axios'; 
import React, { useEffect, useState } from 'react'; 
import './App.css'; 
import BookList from './Components/BookList'; 
import debounce from 'lodash.debounce'; 

const API_URL = 'http://openlibrary.org/search.json'; 

// Function to fetch books from the API
const fetchBooks = async (query, pageNumber = 1, setBooks, setFilteredBooks, setTotalPages, setLoading) => {
  try {
    setLoading(true); // Set loading to true to indicate a fetch is in progress
    const response = await axios.get(`${API_URL}?q=${query}&page=${pageNumber}&limit=10`);

    if (response.data && Array.isArray(response.data.docs)) {
      // If the response is valid and contains an array of books
      setBooks(response.data.docs); // Update the books state
      setFilteredBooks(response.data.docs); // Update the filtered books state
      setTotalPages(Math.ceil(response.data.numFound / 10)); // Calculate and set the total number of pages
    } else {
      console.error('Invalid response structure', response.data); // Log an error if the response is invalid
    }
  } catch (error) {
    console.error('Error fetching books:', error); // Log an error if the fetch fails
  } finally {
    setLoading(false); // Set loading to false to indicate the fetch is complete
  }
};

// Debounced function to fetch books, to avoid excessive API calls
const debouncedFetchBooks = debounce((query, page, setBooks, setFilteredBooks, setTotalPages, setLoading) => {
  fetchBooks(query, page, setBooks, setFilteredBooks, setTotalPages, setLoading);
}, 300); // Debounce with a delay of 300ms

const App = () => {
  const [books, setBooks] = useState([]); // State to hold all books
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const [filteredBooks, setFilteredBooks] = useState([]); // State to hold filtered books
  const [page, setPage] = useState(1); // State to track the current page
  const [totalPages, setTotalPages] = useState(1); // State to track the total number of pages
  const [loading, setLoading] = useState(false); // State to track loading

  // Effect to fetch books when searchQuery or page changes
  useEffect(() => {
    debouncedFetchBooks(searchQuery || 'react', page, setBooks, setFilteredBooks, setTotalPages, setLoading);
  }, [searchQuery, page]);

  // Function to add a new book
  const addBook = (newBook) => {
    setBooks(prevBooks => [...prevBooks, newBook]); // Update books state to include the new book
    setFilteredBooks(prevBooks => [...prevBooks, newBook]); // Update filteredBooks state to include the new book
  };

  // Function to handle editing a book
  const handleEdit = (updatedBook) => {
    const updatedBooks = books.map(book =>
      book.key === updatedBook.key ? updatedBook : book
    );
    setBooks(updatedBooks); // Update books state with the updated book
    setFilteredBooks(updatedBooks); // Update filteredBooks state with the updated book
  };

  // Function to delete a book
  const deleteBook = (id) => {
    setBooks(books.filter(book => book.key !== id)); // Remove the book from the books state
    setFilteredBooks(filteredBooks.filter(book => book.key !== id)); // Remove the book from the filteredBooks state
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update searchQuery state with the input value
    setPage(1); // Reset to the first page on a new search
  };

  // Function to handle next page navigation
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Increment page state if not on the last page
    }
  };

  // Function to handle previous page navigation
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // Decrement page state if not on the first page
    }
  };

  // Function to handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    fetchBooks(searchQuery, page, setBooks, setFilteredBooks, setTotalPages, setLoading); // Fetch books based on searchQuery
  };

  // Render component JSX
  return (
    <div className='app-container'>
    <div className='App'>
      <h1>List Of Books</h1>
      <form className='search' onSubmit={handleSearchSubmit}>
        <input
          className='sear'
          type='text'
          placeholder='Search a Book'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className='src' type='submit'>Search</button>
      </form>
      {loading && <p>Loading...</p>} {/* Loading indicator */}
      <div className='container'>
        <BookList 
          books={filteredBooks}
          handleEdit={handleEdit}
          handleDelete={deleteBook}
          addBook={addBook}
        />
      </div>
      </div>
      <div className='pagination'>
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default App;
