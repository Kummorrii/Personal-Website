import React from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

function AboutTile({ bio, socialLinks, onOpen }) {
  // Repeat the set enough times that the track is always taller than the tile,
  // then slide by exactly one set so the loop is seamless.
  const COPIES = 8;
  const repeated = Array.from({ length: COPIES }, () => socialLinks).flat();

  return (
    <div className="glass-card tile tile--about">
      <div
        className="about-main"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <div className="tile__head">
          <div>
            <span className="expandable-card__eyebrow">Portfolio</span>
            <h3 className="expandable-card__title expandable-card__title--lg">About Me</h3>
          </div>
          <span className="tile__open-icon" aria-hidden="true">
            <FaArrowUpRightFromSquare />
          </span>
        </div>

        <p className="about-preview">{bio}</p>

        <span className="expandable-card__hint">Click to expand</span>
      </div>

      <div className="social-ticker" aria-label="Social media links">
        <div className="social-ticker__track" style={{ '--copies': COPIES }}>
          {repeated.map(({ id, label, href, icon }, i) => (
            <a
              key={`${id}-${i}`}
              className="social-ticker__icon"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={(e) => e.stopPropagation()}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutTile;
