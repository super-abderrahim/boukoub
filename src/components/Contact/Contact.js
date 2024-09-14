// src/components/ContactPage.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Contact.css";
import email from "../../assets/email-black.png";
import instagram from "../../assets/instagram-black.png";
import facebbok from "../../assets/facebook-black.png";
import tiktok from "../../assets/tiktok-black.png";
import books from "../../assets/boooks.jfif";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ContactPage = () => {
  const { t } = useTranslation(); // Destructure t from useTranslation
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [messageSent, setMessageSent] = useState(false);

  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://bookoub-server.onrender.com/send', formData);

      setMessageSent(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  useEffect(() => {
    if (messageSent) {
      const timer = setTimeout(() => setMessageSent(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageSent]);

  return (
    <div className="contact-page">
      <div className="contact-info">
        <h2>
          {t('contactPage.contactUs')} <span className="highlight">{t('contactPage.Us')}</span>
        </h2>
        <p>
          {t('contactPage.message')}
        </p>
        <div className="info">
          <h4>{t('contactPage.info')}</h4>
          <div className="infos-container">
            <div className="info-item">
              <span className="info-title">
                <img src={email} alt={t('contactPage.email')} /> {t('contactPage.email')}
              </span>
              <a href="mailto:bookoubstore@gmail.com">{t('contactPage.Email')}</a>
            </div>
          </div>
        </div>
        <div className="social-links">
          <h4>{t('contactPage.link')}</h4>
          <div className="socialmedia-container">
            <a
              href="https://www.instagram.com/bookoub.store?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="social-icon"
              aria-label={t('contactPage.instagram')}
            >
              <img src={instagram} alt={t('contactPage.instagram')} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100093635761337"
              className="social-icon"
              aria-label={t('contactPage.facebook')}
            >
              <img src={facebbok} alt={t('contactPage.facebook')} />
            </a>
            <a
              href="https://www.tiktok.com/@bookoub.store?_t=8p4KiVxwCr0&_r=1"
              className="social-icon"
              aria-label={t('contactPage.tiktok')}
            >
              <img src={tiktok} alt={t('contactPage.tiktok')} />
            </a>
          </div>
        </div>
      </div>

      <div className="contact-form">
        <h3>{t('contactPage.sendMessage')}</h3>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>{t('contactPage.name')}</label>
            <div className="first">
              <input
                type="text"
                name="first_name"
                placeholder={t('contactPage.firstName')}
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder={t('contactPage.lastName')}
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('contactPage.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('contactPage.emaillabel')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('contactPage.subject')}</label>
            <input
              type="text"
              name="subject"
              placeholder={t('contactPage.subjectlabel')}
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder={t('contactPage.messagePlaceholder')}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit">
            {t('contactPage.send')}
          </button>
        </form>
        {messageSent && <p className="swap">{t('contactPage.sentSuccessfully')}</p>}
      </div>
      <img src={books} className="book-image"  />
    </div>
  );
};

export default ContactPage;
