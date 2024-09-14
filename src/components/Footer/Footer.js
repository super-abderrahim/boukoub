import React, { useState } from "react";
import './Footer.css';
import email from '../../assets/email.png';
import instagram from '../../assets/instagram.png';
import facebook from '../../assets/facebook.png';
import tiktok from '../../assets/tiktok.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const [copied, setCopied] = useState(""); // To track what's copied
  const { t } = useTranslation();

  const emailtext = "boukoubstore@gmail.com";

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(text);  // Show what was copied
          setTimeout(() => setCopied(""), 2000); // Clear after 2 seconds
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      fallbackCopyText(text);  // Fallback for unsupported browsers
    }
  };

  // Fallback for older browsers
  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Avoid scrolling to the bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");  // Fallback method
      setCopied(text);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Fallback: Could not copy text", err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <h2>{t('footer.companyName')}</h2>
        <div className="footer-section">
          <p><a href="/">{t('footer.home')}</a></p>
          <p><a href="/shop">{t('footer.shop')}</a></p>
          <p><a href="/about-us">{t('footer.aboutUs')}</a></p>
          <p><a href="/contact">{t('footer.contact')}</a></p>
        </div>
        <div className="footer-section">
          {/* Email icon with copy functionality */}
          <p onClick={() => copyToClipboard(emailtext)}>
            <img src={email} alt="Email" />
            <span></span> {/* Optional: display the email */}
          </p>

          {/* TikTok */}
          <p>
            <img src={tiktok} alt="TikTok" />
            <a href="https://www.tiktok.com/@bookoub.store?_t=8p4KiVxwCr0&_r=1" 
              target="_blank" 
              rel="noopener noreferrer"></a>
          </p>

          {/* Instagram */}
          <p>
            <img src={instagram} alt="Instagram" />
            <a href="https://www.instagram.com/bookoub.store?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"></a>
          </p>

          {/* Facebook */}
          <p>
            <img src={facebook} alt="Facebook" />
            <a href="https://www.facebook.com/profile.php?id=100093635761337" 
              target="_blank" 
              rel="noopener noreferrer"></a>
          </p>

        </div>

        {copied && <p className="copy">{t('footer.emailCopied')}</p>}
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
