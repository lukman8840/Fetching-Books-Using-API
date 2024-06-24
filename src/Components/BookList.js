import React, { useState } from 'react';
import './BookList.css';
import BookForm from './BookForm';

const BookList = ({ books, handleEdit, handleDelete, addBook }) => {
  // State variables for book details
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [editingBook, setEditingBook] = useState(null); // Track the book being edited
  const [insertModalOpen, setInsertModalOpen] = useState(false); // Track if insert modal is open

  // Handle edit button click
  const handleEditClick = (book) => {
    setEditingBook(book); // Set the book being edited
    setTitle(book.title || ''); // Set the title of the book in the form
    setAuthor(book.author_name ? book.author_name[0] : ''); // Set the author of the book in the form
    setYear(book.first_publish_year || ''); // Set the year of the book in the form
  };

  // Handle updating the book details
  const handleUpdate = () => {
    const updatedBook = {
      ...editingBook,
      title,
      author_name: [author],
      first_publish_year: year
    };
    handleEdit(updatedBook); // Call handleEdit prop to update the book
    setEditingBook(null); // Reset editing book
    setTitle(''); // Reset title input field
    setAuthor(''); // Reset author input field
    setYear(''); // Reset year input field
  };

  // Handle cancelling the edit
  const handleCancel = () => {
    setEditingBook(null); // Reset editing book
    setTitle(''); // Reset title input field
    setAuthor(''); // Reset author input field
    setYear(''); // Reset year input field
  };

  // Handle inserting a new book
  const handleInsert = () => {
    setInsertModalOpen(true); // Open the insert modal
  };

  // Handle closing the insert modal
  const handleInsertClose = () => {
    setInsertModalOpen(false); // Close the insert modal
  };

  return (
    <div>
      <ul className='ul'>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} by {' '}
            {book.author_name ? book.author_name[0] : 'Unknown author'} 
            ({book.first_publish_year || 'Unknown year'})

            <div className='buttons'>
              <button className='insert' onClick={handleInsert}>Insert</button>
              <button onClick={() => handleEditClick(book)} className='edit'>Edit</button>
              <button onClick={() => handleDelete(book.key)} className='delete'>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editingBook && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCancel}>&times;</span>
            <h2>Edit Book</h2>
            <input 
              type='text' 
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              type='text' 
              placeholder='Author'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input 
              type='text' 
              placeholder='Year'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button className='update' onClick={handleUpdate}>Update Book</button>
            <button className='cancel' onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {insertModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleInsertClose}>&times;</span>
            <h2>Add New Book to the List</h2>
            <BookForm addBook={(newBook) => {
              addBook(newBook); // Use the addBook function passed as a prop
              handleInsertClose(); // Close the modal
            }}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
