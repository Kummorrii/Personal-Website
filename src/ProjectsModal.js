import React, { useEffect } from 'react';
import { FaGithub, FaTimes } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

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
            Interactive web, game development, and machine learning, with more on the way as new projects ship.
          </p>

          <div className="modal__grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card-full">
                <h3 className="project-card-full__title">{project.title}</h3>
                <p className="project-card-full__role">{project.role}</p>
                <p className="project-card-full__team">{project.team}</p>

                <p className="project-card-full__description">{project.description}</p>

                <ul className="project-card-full__bullets">
                  {project.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="project-card-full__tags">
                  {project.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="project-card-full__links">
                  <a
                    className="project-card-full__link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub /> View on GitHub
                  </a>
                  {project.liveHref && (
                    <a
                      className="project-card-full__link"
                      href={project.liveHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaArrowUpRightFromSquare /> Open live site
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
