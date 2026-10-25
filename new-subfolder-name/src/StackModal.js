import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { stack, stackCategories } from './TechStack';

function StackModal({ onClose }) {
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
        aria-label="Stack I Use"
      >
        <div className="modal__header">
          <div>
            <span className="expandable-card__eyebrow">Stack I Use</span>
            <p className="modal__hint">Press Esc or use the close button to exit</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="modal__body">
          <h2 className="modal__title">Tools, frameworks, and systems I work with.</h2>
          <p className="modal__subtitle">
            Picked up building real projects — from the F1 predictor's ML pipeline to
            this site's React frontend.
          </p>

          <div className="modal__grid modal__grid--stack">
            {stackCategories.map((category) => (
              <div className="stack-category-card" key={category.label}>
                <span className="modal__section-label">{category.label}</span>
                <div className="modal__bubbles">
                  {category.items.map((itemName) => {
                    const tech = stack.find((t) => t.name === itemName);
                    return (
                      <span className="tag-chip tag-chip--stackmodal" key={itemName}>
                        {tech?.icon} {itemName}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackModal;
