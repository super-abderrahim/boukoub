import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import axios from "axios";
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
// import homepage from '../../assets/homeimage.jpg';
import review_image from '../../assets/reviews-imge.png';
import ins from '../../assets/ins.jpg';
import ins2 from '../../assets/ins2.jpg';
import ins4 from '../../assets/ins4.jpg';
import decor from '../../assets/decor.jpg';
import ligend from '../../assets/Ligend0.png';
import express from '../../assets/express.jpg';
import toread from '../../assets/room to read.png';
import send from '../../assets/send-collaboration.png';
import instagram_icon from '../../assets/instagram.png';
import { useTranslation } from 'react-i18next';
const Home = () => {
  const { t } = useTranslation();
const [monthlyBooks, setMonthlyBooks] = useState([]);
  useEffect(() => {
    axios.get('https://bookoub-server.onrender.com/api/books')
      .then(response => {
        // Filter books where isMonthly is true
        const monthly = response.data.filter(book => book.isMonthly);
        setMonthlyBooks(monthly);
        console.log(monthly)   // Store filtered books in the state
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    });

    const elements = document.querySelectorAll('.scroll-animation');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h3 className="hero-title">
            {t('home.welcomeMessage')}
            <span className="highlight"> <br />{t('home.bookoub')}</span>
          </h3>
          <p>{t('home.description')}</p>
          <Link to="/shop" className="navbar-link">
            <button className="shop-now-button">{t('home.shopNow')}</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src='https://res.cloudinary.com/daw9y8sq2/image/upload/v1726215175/homeimage_dbzlbr.jpg' alt={t('home.heroImageAlt')} />
        </div>
      </section>

      <section className="join-us-section">
        <h2>{t('joinUs.title')}</h2>
        <div className="collaboration-instargam">
          <div className="collaboration-section scroll-animation">
            <h4>{t('joinUs.collaboration')}</h4>
            <div className="collaboration-logos">
              <div className="collaboration-logos-wrapper">
                <a href="https://www.instagram.com/decorilliy/" target="_blank" rel="noopener noreferrer">
                  <img src={decor} alt={t('joinUs.decorily')} />
                </a>
                <a href="https://www.roomtoread.org/" target="_blank" rel="noopener noreferrer">
                  <img src={toread} alt={t('joinUs.roomToRead')} />
                </a>
                <a href="https://www.instagram.com/legend___tech?igsh=MWY3OXRldm1mNzVq" target="_blank" rel="noopener noreferrer">
                  <img src={ligend} alt={t('joinUs.legend')} />
                </a>
                <a href="https://www.instagram.com/zr__express?igsh=MWt2dTR2dXpwZmtvaQ%3D%3D" target="_blank" rel="noopener noreferrer">
                  <img src={express} alt={t('joinUs.express')} />
                </a>
              </div>
              <div className="collaboration-logos-wrapper">
                <a href="https://www.instagram.com/decorilliy/" target="_blank" rel="noopener noreferrer">
                  <img src={decor} alt={t('joinUs.decorily')} />
                </a>
                <a href="https://www.roomtoread.org/" target="_blank" rel="noopener noreferrer">
                  <img src={toread} alt={t('joinUs.roomToRead')} />
                </a>
                <a href="https://www.instagram.com/legend___tech?igsh=MWY3OXRldm1mNzVq" target="_blank" rel="noopener noreferrer">
                  <img src={ligend} alt={t('joinUs.legend')} />
                </a>
                <a href="https://www.instagram.com/zr__express?igsh=MWt2dTR2dXpwZmtvaQ%3D%3D" target="_blank" rel="noopener noreferrer">
                  <img src={express} alt={t('joinUs.express')} />
                </a>
              </div>
            </div>
            <button className="collaborate-btn" onClick={() => navigate('/contact')}>
              {t('joinUs.collaborate')} <img src={send} alt={t('joinUs.sendIcon')} />
            </button>
          </div>
          <div className="instagram-group scroll-animation">
            <h3>{t('joinUs.instagramGroup')}</h3>
            <div className="group-content">
              <a href="https://ig.me/j/AbaLBDKMQnsNvwl0/" className="join-btn" target="_blank" rel="noopener noreferrer">
                {t('joinUs.join')} <img src={instagram_icon} alt={t('joinUs.instagramIcon')} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="books-of-the-month-section">
        <h2><span></span> {t('booksOfTheMonth.title')}</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={5}
        >
          {monthlyBooks.map((book) => (
            <SwiperSlide className='book-item' 
            key={book.id}
            onClick={() => navigate(`/product/${book._id}`)}
            >
              <img src={book.image} alt={book.title} />
              <div className="title-price-slider">
                <h5>{book.title}</h5>
                <h5>{book.price} Da</h5>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="reviews-section">
        <div className="image-section">
          <img src={review_image} alt={t('reviews.imageAlt')} />
        </div>
        <div className="rev">
          <h1>{t('reviews.title')} <span></span></h1>
          <div className="review-item-container">
            <div className="review-item scroll-animation">
              <img src={ins} alt={t('reviews.ins1.alt')} />
              <p>{t('reviews.ins1.text')}</p>
            </div>
            <div className="review-item scroll-animation">
              <img src={ins2} alt={t('reviews.ins2.alt')} />
              <p>{t('reviews.ins2.text')}</p>
            </div>
            <div className="review-item scroll-animation">
              <img src={ins4} alt={t('reviews.ins3.alt')} />
              <p>{t('reviews.ins3.text')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
