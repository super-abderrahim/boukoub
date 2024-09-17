import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Shop.css";
import { useNavigate } from 'react-router-dom';
import search from '../../assets/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.png';
import back from '../../assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.png';
import filter from '../../assets/filter.png';
import { useTranslation } from 'react-i18next';
const ShopPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [buttonColors, setButtonColors] = useState({});
  const sidebar = useRef(null);
  const booksPerPage = 8;
  const navigate = useNavigate();

  const { t } = useTranslation();
  useEffect(() => {
    axios.get('https://bookoub-server.onrender.com/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((book) =>
        book.categories.includes(selectedCategory)
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((book) => book.type === selectedType);
    }

    if (selectedLanguage) {
      filtered = filtered.filter((book) =>
        book.languages.includes(selectedLanguage)
      );
    }

    filtered = filtered.filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    if (searchQuery) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [books, selectedCategory, selectedType, selectedLanguage, priceRange, searchQuery]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
  };

  const handlePriceChange = (event) => {
    setPriceRange([0, event.target.value]);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const filterclick = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleAddToCart = (e, book, quantity = 1) => {
    e.stopPropagation();
    console.log("Adding to cart:", book);
    addToCart(book, quantity);
    const buttonId = `button-${book._id}`;

    setButtonColors((prevColors) => ({
      ...prevColors,
      [buttonId]: '#07A970'
    }));

    setTimeout(() => {
      setButtonColors((prevColors) => ({
        ...prevColors,
        [buttonId]: '#e63946'
      }));
    }, 800);
  };

  const addToCart = (book, quantity) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItemIndex = cartItems.findIndex(item => item._id === book._id);

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ ...book, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Added to cart:", book.title, "Quantity:", quantity);
  };

  const categories = [...new Set(books
    .flatMap((book) => book.categories)
    .map(category => category.trim())
    .filter(category => category.length > 0)
  )];
  const types = [...new Set(books.map((book) => book.type))];
  const languages = [...new Set(books.flatMap((book) => book.languages))];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebar.current &&
        !sidebar.current.contains(event.target)
      ) {
        setSidebarVisible(false);
      }
    };

    if (sidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarVisible]);

  return (
    <div className="shop-page">
  {sidebarVisible && <div className="overlay"></div>}
  <aside className={`sidebar ${sidebarVisible ? 'visible' : ''}`} ref={sidebar}>
    <h4>   {t('shopPage.shopByCategory')}</h4>
    <ul>
      <li onClick={() => handleCategoryChange("All")}>{t('shopPage.all')}</li>
      {categories.map((category) => (
        <li key={category} onClick={() => handleCategoryChange(category)}>
          {category}
        </li>
      ))}
    </ul>

    <h4>{t('shopPage.type')}</h4>
    <ul>
      <li onClick={() => handleTypeChange("All")}>{t('shopPage.all')}</li>
      {types.map((type) => (
        <li key={type} onClick={() => handleTypeChange(type)}>
          {type}
        </li>
      ))}
    </ul>

    <h4>{t('shopPage.language')}</h4>
    <div className="lang">
      {languages.map((language) => (
        <div key={language} className="radio-container">
          <input
            type="radio"
            id={`radio-${language}`}
            name="language"
            value={language}
            onChange={() => handleLanguageChange(language)}
            checked={selectedLanguage === language}
          />
          <label htmlFor={`radio-${language}`}>
            {language}
          </label>
        </div>
      ))}
    </div>

    <h4>{t('shopPage.price')}</h4>
    <input
      className="price-input"
      type="range"
      min="0"
      max="10000"
      value={priceRange[1]}
      onChange={handlePriceChange}
    />
    <span className="price-span">{priceRange[1]} Da</span>
    <img onClick={filterclick} className="close-button" src={back} alt="" />
  </aside>

  <main className="main-content">
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder={t('shopPage.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button><img src={search} alt={t('shopPage.search')} /></button>
      </div>
      <button onClick={filterclick}><img src={filter} alt={t('shopPage.filter')} /></button>
    </div>

    <div className="breadcrumb">
      <span>{selectedCategory}</span>&nbsp;&nbsp; &gt; &nbsp;&nbsp;<span>{selectedType}</span>
    </div>

    <div className="product-grid">
  {currentBooks.map((book) => (
    <div key={book._id} className="product-card">
      <img src={book.image} onClick={() => navigate(`/product/${book._id}`)} alt={book.title} />
      <h5 onClick={() => navigate(`/product/${book._id}`)}>{book.title}</h5>
      <div className="price-container">
        <p onClick={() => navigate(`/product/${book._id}`)}>{book.price} Da</p>
        <button
          id={`button-${book._id}`}
          className="add-button"
          style={{
            backgroundColor: book.quantity === 0 ? '#cccccc' : (buttonColors[`button-${book._id}`] || '#e63946'),
            cursor: book.quantity === 0 ? 'not-allowed' : 'pointer',
          }}
          onClick={(e) => {
            if (book.quantity !== 0) {
              handleAddToCart(e, book);
            }
          }}
          disabled={book.quantity === 0}
        >
          {book.quantity === 0 ? t('shopPage.outOfStock') : t('shopPage.addToCart')}
        </button>
      </div>
    </div>
  ))}
</div>


        <div className="pagination">
          <span
            onClick={() => handlePageChange(currentPage - 1)}
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            {t('shopPage.pagePrevious')}
          </span>

          {/* Display current page and total pages in the "1/8" format */}
          <span className="page-info">
            {`${currentPage}/${totalPages}`}
          </span>

          <span
            onClick={() => handlePageChange(currentPage + 1)}
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            {t('shopPage.pageNext')}
          </span>
        </div>
  </main>
</div>

  );
};

export default ShopPage;
