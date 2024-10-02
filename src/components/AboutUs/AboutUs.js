import React, { useEffect, useState } from 'react';
import './AboutUs.css';
import lyna from '../../assets/reading.jpg';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AboutUs = () => {
  const { t } = useTranslation(); // Destructure t from useTranslation

  // Function to calculate age based on birthdate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  // Set Lyna's birthdate
  const [lynaAge, setLynaAge] = useState(calculateAge('2002-11-24'));

  // Recalculate age every time the component is rendered, useful if the date changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLynaAge(calculateAge('2002-11-24'));
    }, 1000 * 60 * 60 * 24); // Update every day

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aboutus-animate');
        }
      });
    });

    const elements = document.querySelectorAll('.aboutus-scroll-animation');
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
    <section className="about-us-section">
      <div className="about-us-container">
        <div className="image-intro aboutus-scroll-animation">
          <h1 className="about-us-heading">
            ABOUT <span className="highlight">US</span>
          </h1>
          <p className="about-us-intro">
            {t('aboutUs.welcomeMessage')}
          </p>
        </div>

        <div className="about-us-content">
          <div className="about-lyna aboutus-scroll-animation">
            <h2 className="meet-lyna">
              {t('aboutUs.meetLyna')} ,<br /> 
              <span className="highlight">{t('aboutUs.Founder')}</span>
            </h2>
            <p className="lyna-description">
            {t('aboutUs.lynaDescription', { lynaAge })}
            </p>
          </div>

          <div className="founder-image aboutus-scroll-animation">
            <img src={lyna} alt={t('aboutUs.lynaDescription')} />
          </div>

          <div className="why-bookoub aboutus-scroll-animation">
            <h2 className="meet-lyna">
              {t('aboutUs.whyBookoub')}<br /> 
              <span className="highlight">{t('aboutUs.bookoub')}</span>
            </h2>

            <p className="why-bookoub-description">
              {t('aboutUs.whyBookoubDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
