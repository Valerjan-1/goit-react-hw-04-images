import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 12;

  const fetchImages = async (searchQuery, page) => {
    setIsLoading(true);

    const API_KEY = '40349045-40ce8f9906407a6daca01a4c4';
    const apiUrl = `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const { hits, totalHits } = data;

      setImages(prevImages => [...prevImages, ...hits.slice(0, perPage)]);
      setCurrentPage(prevPage => prevPage + 1);
      setHasMoreImages(page < Math.ceil(totalHits / perPage));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchSubmit = searchQuery => {
    if (searchQuery.trim() !== '') {
      setQuery(searchQuery);
    }
  };

  useEffect(() => {
    if (query.trim() !== '') {
      setImages([]);
      setCurrentPage(1);
      setHasMoreImages(true);
      fetchImages(query, 1);
    }
  }, [query]);

  const handleLoadMore = () => {
    if (!isLoading && hasMoreImages) {
      fetchImages(query, currentPage);
    }
  };

  const openModal = largeURL => {
    setLargeImageURL(largeURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  const shouldRenderLoadMore = images.length > 0 && hasMoreImages && !isLoading;

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} openModal={openModal} />
      {isLoading && (
        <div className="spinnerContainer">
          <Loader />
        </div>
      )}
      {shouldRenderLoadMore && (
        <Button onLoadMore={handleLoadMore} hasMoreImages={hasMoreImages} />
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
