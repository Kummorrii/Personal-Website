import React, { useEffect } from 'react';
import { FaGithub, FaTimes } from 'react-icons/fa';

function ProjectsModal({ projects, onClose }) {
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
        aria-label="Projects"
      >
        <div className="modal__header">
          <div>
            <span className="expandable-card__eyebrow">Projects</span>
            <p className="modal__hint">Press Esc or use the close button to exit</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="modal__body">
          <h2 className="modal__title">Selected projects &amp; implementation work.</h2>
          <p className="modal__subtitle">
            Full-stack and machine-learning builds, with more on the way as new projects ship.
          </p>

          <div className="modal__grid">
            {projects.map((project) => (
              <a
                key={project.id}
                className="project-card-full"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="project-card-full__image"
                  src={project.image}
                  alt={project.title}
                />
                <h3 className="project-card-full__title">{project.title}</h3>
                <p className="project-card-full__role">{project.role}</p>
                {project.badge && (
                  <p className="project-card-full__badge">{project.badge}</p>
                )}
                <p className="project-card-full__team">{project.team}</p>

                <p className="project-card-full__description">{project.description}</p>

                <ul className="project-card-full__bullets">
                  {project.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="project-expanded__tags">
                  {project.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>{tag}</span>
                  ))}
                </div>

                <span className="project-card-full__link">
                  <FaGithub /> View on GitHub
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
