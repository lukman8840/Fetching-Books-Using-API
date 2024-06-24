import React, { useState } from 'react';
import './BookForm.css';

const BookForm = ({ addBook }) => {
  // State variables for the book title, author, and year
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      title, // Set the title of the new book
      author_name: [author], // Set the author of the new book
      first_publish_year: year, // Set the year of the new book
    };
    addBook(newBook); // Call addBook prop to add the new book to the list
    setTitle(''); // Reset the title input field
    setAuthor(''); // Reset the author input field
    setYear(''); // Reset the year input field
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update title state on input change
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)} // Update author state on input change
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)} // Update year state on input change
      />
      <button className='submit' type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
