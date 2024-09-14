import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Contact from './components/Contact/Contact';
import Shop from './components/Shop/Shop';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import AboutUs from './components/AboutUs/AboutUs';
import './App.css'; // Import your global CSS file for styling
import './i18n';
function App() {
  return (
    <Router>
            <div className="app">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </main>
              <Footer />
            </div>
    </Router>
  );
}

export default App;
