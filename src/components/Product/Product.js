import React, { useState, useEffect } from 'react';
import './Product.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import back from '../../assets/arrow-left.png';
import best_seller from '../../assets/best_seller.png';
import { useTranslation } from 'react-i18next';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Destructure `t` from `useTranslation`
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buttonColor, setButtonColor] = useState('white'); // Default background color
  const [textColor, setTextColor] = useState('black'); // Default text color

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://bookoub-server.onrender.com/api/books/${id}`);
        // const response = await axios.get(`http://localhost:3000/api/books/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className='loading'>{t('bookPage.loading')}</div>;
  }

  const handleAddToCart = (e, book, quantity = 1) => {
    e.stopPropagation();
    addToCart(book, quantity);

    // Change button colors
    setButtonColor('#07A970'); // Set background color to green
    setTextColor('white'); // Set text color to white

    // Revert button colors after 1.5 seconds
    setTimeout(() => {
      setButtonColor('white'); // Revert background color to white
      setTextColor('black'); // Revert text color to black
    }, 1500); // Change to 1500ms
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

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    handleAddToCart(new Event('click'), product, quantity); // Add to cart with a quantity of 1
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div className="product-container">
      <button className="back-button" onClick={handleBack}>
        <img src={back} alt={t('back')} />
      </button>
      <div className="product-content">
        <img 
          src={product.image} 
          alt={t('bookPage.book_cover') + ` ${product.title}`} 
          className="product-image" 
        />
        <div className="product-details">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">
            {product.description || t('bookPage.description')}
          </p>
          <div className="category-lang-container">
            <h4 className="product-category">
              {t('bookPage.category')} <br /><br /> 
              <span>{product.categories.join(" , ")}</span>
            </h4>
          </div>

          <div className="product-price-container">
            <h4 className="product-price">
              {t('bookPage.price')} <br /><br /> 
              <span>{product.price} Da</span>
            </h4>
            <h4 className="product-price">
              {t('bookPage.total')} <br /><br /> 
              <span>{product.price * quantity} Da</span>
            </h4>
          </div>

          <div className="quantity-controls">
            <button onClick={handleDecrease} className="quantity-btn minus">-</button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={handleIncrease} className="quantity-btn plus">+</button>
          </div>
          <div className="product-buttons">
            <button 
              className="add-to-cart" 
              style={{ backgroundColor: buttonColor, color: textColor }}
              onClick={(e) => handleAddToCart(e, product, quantity)}
            >
              {t('bookPage.addToCart')}
            </button>
            <button 
              className="buy-now" 
              onClick={handleBuyNow}
            >
              {t('bookPage.buyNow')}
            </button>
          </div>
        </div>
        <img src={best_seller} className='best_seller' alt={t('best_seller')} />
      </div>
    </div>
  );
};

export default Product;
