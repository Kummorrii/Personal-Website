import React from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

function ProjectsTile({ projects, onOpen }) {
  const preview = projects[0];

  return (
    <div
      className="glass-card tile tile--projects"
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
          <span className="expandable-card__eyebrow">Projects</span>
          <h3 className="expandable-card__title">Systems, products, &amp; creative builds.</h3>
        </div>
        <span className="tile__open-icon" aria-hidden="true">
          <FaArrowUpRightFromSquare />
        </span>
      </div>

      <div className="project-preview">
        <p className="project-preview__title">{preview.title}</p>
        <p className="project-preview__role">{preview.role}</p>
        <div className="project-preview__tags">
          {preview.tags.slice(0, 3).map((tag) => (
            <span className="tag-chip tag-chip--tiny" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsTile;
