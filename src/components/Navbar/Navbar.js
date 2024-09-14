import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css'; // Import your CSS file
// Import the CSS file for styling
import logo from '../../assets/logo.png';
import cart from '../../assets/cart-logo.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t } = useTranslation(); // Initialize translation function

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logo} alt="Logo" />
            </Link>
            <div className="hamburger" onClick={toggleMenu}>
                {/* Hamburger icon here */}
            </div>
            <ul className={`navbar-menu ${menuOpen ? 'active' : 'hidden'}`}>
                <li onClick={toggleMenu} className="navbar-item">
                    <Link to="/" className="navbar-link">{t('navbar.home')}</Link>
                </li>
                <li onClick={toggleMenu} className="navbar-item">
                    <Link to="/shop" className="navbar-link">{t('navbar.shop')}</Link>
                </li>
                <li onClick={toggleMenu} className="navbar-item">
                    <Link to="/about-us" className="navbar-link">{t('navbar.aboutUs')}</Link>
                </li>
                <li onClick={toggleMenu} className="navbar-item">
                    <Link to="/contact" className="navbar-link">{t('navbar.contact')}</Link>
                </li>
            </ul>
            <Link to="/Cart" className="cart-container">
                <img src={cart} className='cart' alt="Cart" />
            </Link>
        </nav>
    );
};

export default Navbar;
