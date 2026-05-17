import React, { useEffect, useState } from 'react';
import './App.css';
import { FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

function App() {
  const [photoReady, setPhotoReady] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const [uiReady, setUiReady] = useState(false);

  useEffect(() => {
    // Phase 1 — photo fades in
    const t1 = setTimeout(() => setPhotoReady(true), 80);
    // Phase 2 — text fades up (after photo starts appearing)
    const t2 = setTimeout(() => setTextReady(true), 400);
    // Phase 3 — nav + footer + icons
    const t3 = setTimeout(() => setUiReady(true), 900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const socialLinks = [
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/me.is.glennorlanes',
      icon: <FaFacebook />,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/cigglen/',
      icon: <FaInstagram />,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/Kummorrii',
      icon: <FaGithub />,
    },
  ];

  return (
    <div className="app">
      {/* Decorative background */}
      <div className="bg-grain" aria-hidden="true" />
      <div className="bg-circle bg-circle--1" aria-hidden="true" />
      <div className="bg-circle bg-circle--2" aria-hidden="true" />
      <div className="bg-circle bg-circle--3" aria-hidden="true" />

      {/* ── Header ── */}
      <header className={`header ${uiReady ? 'visible' : ''}`} role="banner">
        <span className="header__logo">Glenn Michael Orlanes</span>
        <a
          className="header__contact"
          href="mailto:glennmichaelorlanes@gmail.com"
          aria-label="Send email to Glenn"
        >
          glennmichaelorlanes@gmail.com
        </a>
      </header>

      {/* ── Hero ── */}
      <main className="hero" id="hero" role="main">
        <div className="hero__inner">

          {/* Photo */}
          <div className={`hero__photo-wrap ${photoReady ? 'animate' : ''}`}>
            <img
              className="hero__photo"
              src={`${process.env.PUBLIC_URL}/profile.jpg`}
              alt="Glenn Michael Orlanes"
            />
          </div>

          {/* Text */}
          <div className="hero__text">
            <p className={`hero__eyebrow ${textReady ? 'animate' : ''}`}>
              Personal Website
            </p>

            <h1 className={`hero__name ${textReady ? 'animate' : ''}`}>
              <span className="line1">Glenn</span>
              <span className="line2">Michael Orlanes</span>
            </h1>

            <div className={`hero__divider ${textReady ? 'animate' : ''}`} />

            <p className={`hero__tagline ${textReady ? 'animate' : ''}`}>
              &#x22;Νεχ ποσσυμ τεχυμ ωιωερε, νεχ σινε τε.&#x22;
            </p>
          </div>
        </div>
      </main>

      {/* ── Social Sidebar ── */}
      <nav
        className={`social ${uiReady ? 'visible' : ''}`}
        aria-label="Social media links"
      >
        <div className="social__line" aria-hidden="true" />
        {socialLinks.map(({ id, label, href, icon }) => (
          <a
            key={id}
            id={`social-${id}`}
            className="social__icon"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-label={label}
          >
            {icon}
          </a>
        ))}
      </nav>

      {/* ── Footer ── */}
      <footer className={`footer ${uiReady ? 'visible' : ''}`} role="contentinfo">
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Glenn Michael Orlanes
        </p>
      </footer>
    </div>
  );
}

export default App;
