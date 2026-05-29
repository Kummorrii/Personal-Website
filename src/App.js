import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';
import GradientShader from './GradientShader';
import WaterDrop from './WaterDrop';

const BLEND_LERP = 0.055;

const luminanceToBlend = (lum) => {
  const t = (lum - 0.36) / 0.28;
  return Math.max(0, Math.min(1, t));
};

function App() {
  const [photoReady, setPhotoReady] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const [uiReady, setUiReady] = useState(false);
  const [introReveal, setIntroReveal] = useState(0);
  const [rippleReveal, setRippleReveal] = useState(0);
  const [dropActive, setDropActive] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [bgFlowing, setBgFlowing] = useState(false);

  const heroTextRef = useRef(null);
  const headerRef = useRef(null);
  const socialRef = useRef(null);
  const footerRef = useRef(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const smoothBlendRef = useRef({ hero: 0, header: 0, social: 0, footer: 0 });

  useEffect(() => {
    document.body.classList.add('intro-active');

    const t1 = setTimeout(() => setPhotoReady(true), 300);
    const t2 = setTimeout(() => setTextReady(true), 850);
    const t3 = setTimeout(() => setUiReady(true), 1300);
    // Text tagline finishes ~850 + 550ms delay + 850ms anim ≈ 2250ms
    const tDrop = setTimeout(() => setDropActive(true), 2300);
    const t4 = setTimeout(() => {
      setPageReady(true);
      document.body.classList.remove('intro-active');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDrop);
      clearTimeout(t4);
      document.body.classList.remove('intro-active');
    };
  }, []);

  const handleDropImpact = useCallback(() => {
    let frameId;
    const start = performance.now();
    const rippleDuration = 900;
    const introDuration = 1600;

    const tick = (now) => {
      const elapsed = now - start;
      const rippleProgress = Math.min(1, elapsed / rippleDuration);
      const introProgress = Math.min(1, elapsed / introDuration);
      const easedRipple = rippleProgress * rippleProgress * (3 - 2 * rippleProgress);
      const easedIntro = introProgress * introProgress * (3 - 2 * introProgress);

      setRippleReveal(easedRipple);
      setIntroReveal(easedIntro);
      setBgFlowing(true);

      if (rippleProgress < 1 || introProgress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
  }, []);

  const getSamplePoints = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (!width || !height) return [];

    const targets = [
      { key: 'hero', el: heroTextRef.current },
      { key: 'header', el: headerRef.current },
      { key: 'social', el: socialRef.current },
      { key: 'footer', el: footerRef.current },
    ];

    return targets
      .filter((t) => t.el)
      .map(({ key, el }) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return {
          key,
          x: (cx / window.innerWidth) * width,
          y: height - (cy / window.innerHeight) * height,
        };
      });
  }, []);

  const handleLuminance = useCallback((samples) => {
    if (!bgFlowing) return;

    const refs = {
      hero: heroTextRef.current,
      header: headerRef.current,
      social: socialRef.current,
      footer: footerRef.current,
    };

    Object.keys(refs).forEach((key) => {
      const el = refs[key];
      if (!el) return;

      const target = luminanceToBlend(samples[key] ?? 0.2);
      const current = smoothBlendRef.current[key] ?? 0;
      const blend = current + (target - current) * BLEND_LERP;
      smoothBlendRef.current[key] = blend;
      el.style.setProperty('--text-blend', blend.toFixed(4));
    });
  }, [bgFlowing]);

  const handleCanvasReady = useCallback((width, height) => {
    canvasSizeRef.current = { width, height };
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
    <div className={`app ${pageReady ? 'app--ready' : 'app--intro'}`}>
      <GradientShader
        introReveal={introReveal}
        rippleReveal={rippleReveal}
        getSamplePoints={getSamplePoints}
        onLuminance={handleLuminance}
        onCanvasReady={handleCanvasReady}
      />

      <WaterDrop active={dropActive} onImpact={handleDropImpact} />

      <div className="bg-grain" aria-hidden="true" />
      <div className="bg-circle bg-circle--1" aria-hidden="true" />
      <div className="bg-circle bg-circle--2" aria-hidden="true" />
      <div className="bg-circle bg-circle--3" aria-hidden="true" />

      <header
        ref={headerRef}
        className={`header dynamic-text ${uiReady ? 'visible' : ''}`}
        role="banner"
      >
        <span className="header__logo">Glenn Michael Orlanes</span>
        <a
          className="header__contact"
          href="mailto:glennmichaelorlanes@gmail.com"
          aria-label="Send email to Glenn"
        >
          glennmichaelorlanes@gmail.com
        </a>
      </header>

      <main className="hero" id="hero" role="main">
        <div className="hero__inner">
          <div className={`hero__photo-wrap ${photoReady ? 'animate' : ''}`}>
            <div className="hero__photo-glow" aria-hidden="true" />
            <img
              className="hero__photo"
              src={`${process.env.PUBLIC_URL}/profile.jpg`}
              alt="Glenn Michael Orlanes"
            />
          </div>

          <div ref={heroTextRef} className="hero__text dynamic-text">
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

      <nav
        ref={socialRef}
        className={`social dynamic-text ${uiReady ? 'visible' : ''}`}
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

      <footer
        ref={footerRef}
        className={`footer dynamic-text ${uiReady ? 'visible' : ''}`}
        role="contentinfo"
      >
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Glenn Michael Orlanes
        </p>
      </footer>
    </div>
  );
}

export default App;
