import React from 'react';
import { FaHtml5, FaCss3Alt, FaReact, FaPython, FaFigma, FaGitAlt, FaLinux } from 'react-icons/fa';
import { SiJavascript, SiSpring, SiC } from 'react-icons/si';

// Sourced from github.com/Kummorrii — the languages/tools listed on the
// profile README and used across the repos (f1-race-predictor, C
// command-line projects, Personal-Website).
export const stack = [
  { name: 'C', icon: <SiC /> },
  { name: 'HTML5', icon: <FaHtml5 /> },
  { name: 'CSS3', icon: <FaCss3Alt /> },
  { name: 'JavaScript', icon: <SiJavascript /> },
  { name: 'React', icon: <FaReact /> },
  { name: 'Python', icon: <FaPython /> },
  { name: 'Spring', icon: <SiSpring /> },
  { name: 'Figma', icon: <FaFigma /> },
  { name: 'Git', icon: <FaGitAlt /> },
  { name: 'Linux', icon: <FaLinux /> },
];

export const stackCategories = [
  {
    label: 'Languages',
    items: ['C', 'Python', 'JavaScript'],
  },
  {
    label: 'Web & Frontend',
    items: ['HTML5', 'CSS3', 'React'],
  },
  {
    label: 'Backend & Frameworks',
    items: ['Spring'],
  },
  {
    label: 'Tools & Design',
    items: ['Figma', 'Git'],
  },
  {
    label: 'Systems',
    items: ['Linux'],
  },
];

// A continuous horizontal marquee of tech chips, stock-ticker style.
// The list is duplicated so the loop is seamless.
function TechStackTicker() {
  const doubled = [...stack, ...stack];

  return (
    <div className="tech-ticker">
      <div className="tech-ticker__track">
        {doubled.map((tech, i) => (
          <span className="tech-ticker__item" key={`${tech.name}-${i}`}>
            <span className="tech-ticker__icon">{tech.icon}</span>
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TechStackTicker;
