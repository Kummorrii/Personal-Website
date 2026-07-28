import React, { useEffect, useState } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';

function ProfileCard({ icon, label, handle, href, copyValue }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="profile-card">
      <span className="profile-card__icon">{icon}</span>
      <div className="profile-card__info">
        <p className="profile-card__label">{label}</p>
        <p className="profile-card__handle">{handle}</p>
      </div>
      {href ? (
        <a
          className="profile-card__action"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>
      ) : (
        <button className="profile-card__action" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
  );
}

function AboutModal({ bio, interests, socialLinks, email, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal glass-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="About Me"
      >
        <div className="modal__header">
          <div>
            <span className="expandable-card__eyebrow">Portfolio</span>
            <p className="modal__hint">Press Esc or use the close button to exit</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="modal__body">
          <h2 className="modal__title">A bit more about me.</h2>
          <p className="modal__bio">{bio}</p>

          <span className="modal__section-label">Profiles</span>
          <div className="modal__grid modal__grid--profiles">
            {socialLinks.map(({ id, label, handle, href, icon }) => (
              <ProfileCard key={id} icon={icon} label={label} handle={handle} href={href} />
            ))}
            <ProfileCard
              icon={<FaEnvelope />}
              label="Email"
              handle={email}
              copyValue={email}
            />
          </div>

          <span className="modal__section-label modal__section-label--spaced">Interests</span>
          <div className="modal__bubbles">
            {interests.map((interest) => (
              <span className="tag-chip tag-chip--interest" key={interest}>
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
