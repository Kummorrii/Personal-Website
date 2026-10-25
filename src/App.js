import React, { useEffect, useState } from 'react';
import './App.css';
import { FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';
import ParticleField from './ParticleField';
import TechStackTicker from './TechStack';
import ProjectsTile from './ProjectsTile';
import ProjectsModal from './ProjectsModal';
import AboutTile from './AboutTile';
import AboutModal from './AboutModal';
import StackModal from './StackModal';

const bio =
  "Hi, I am Glenn Michael L. Orlanes, Second-year BSIT Student studying in Cebu Institute of Technology - University. I have a huge passion for anything tech related such as devices, programming, cybersecurity and more. I am also a massive gamer.";

const interests = [
  'Gaming',
  'Programming',
  'Manhwas/Manga',
  'Anime',
  'Linux Ricing',
  'Project Creation',
];

const projects = [
  {
    id: 'project-cosima',
    title: 'Project Cosima',
    role: 'Creator · 2026',
    team: 'Solo project',
    description:
      'An interactive 3D map of the Milky Way. Fly to any star, galaxy, or nebula, see it up close, and read about it.',
    bullets: [
      'Renders a procedural 60,000-star galaxy with custom GLSL shaders, so rotation, twinkling, and flares run on the GPU.',
      'Places about 40,000 real stars from the HYG catalog at their true 3D positions around the Sun.',
      'Resolves any object name through SIMBAD, then flies the camera there along a smooth arc.',
      'Shows a detail panel on arrival with a real sky image, distance, coordinates, and a Wikipedia summary.',
      'Adds a focus mode with a stylized 3D model matched to the object type, plus NASA’s Astronomy Picture of the Day.',
      'Keeps the NASA API key on the server with small Vercel serverless functions.',
    ],
    tags: ['React', 'TypeScript', 'Three.js', 'GLSL', 'Vite', 'Vercel'],
    href: 'https://github.com/Kummorrii/Project-Cosima',
    liveHref: 'https://project-cosima.vercel.app',
  },
  {
    id: 'game-jam',
    title: 'Game Jam Project',
    role: 'Game Developer · 2026',
    team: 'Team project · Game jam',
    description:
      'A story-driven Godot game set over a night shift in a hospital, where you play a nurse working through quests, dialogue, and levels.',
    bullets: [
      'Built the cutscenes between levels 8 → 9 and 9 → 10, plus scene lighting.',
      'Added the black-screen story text that plays before the main game starts.',
      'Implemented level-start monologues driven by the JSON dialogue system.',
      'Set up menu music, global gameplay music, and dialogue sounds.',
      'Worked alongside teammates on quests, NPCs, and polish through pull requests.',
    ],
    tags: ['Godot 4', 'GDScript', 'Game Jam', 'Teamwork'],
    href: 'https://github.com/Miksz29/game',
  },
  {
    id: 'f1-race-predictor',
    title: 'F1 Race Predictor',
    role: 'ML Engineer · 2026',
    team: 'Solo project',
    description:
      'A self-updating machine learning system that predicts Formula 1 race outcomes from real historical data, then turns those predictions into probabilities with a large-scale simulation.',
    bullets: [
      'Pulls real historical race results via the FastF1 timing library to build the training set.',
      'Engineers per-driver and per-team form features using only past races, avoiding data leakage.',
      'Trains a Random Forest model to predict finishing position, validated against unseen recent races.',
      'Runs a 5,000-race Monte Carlo simulation to produce win, podium, and points probabilities.',
      'Ships an interactive Streamlit + Altair dashboard to explore the predictions.',
      'Refreshes data, retrains, and re-predicts weekly through GitHub Actions with no manual work.',
    ],
    tags: ['Python', 'scikit-learn', 'FastF1', 'Streamlit', 'GitHub Actions'],
    href: 'https://github.com/Kummorrii/f1-race-predictor',
  },
];

const socialLinks = [
  { id: 'instagram', label: 'Instagram', handle: '@cigglen', href: 'https://www.instagram.com/cigglen/', icon: <FaInstagram /> },
  { id: 'facebook', label: 'Facebook', handle: 'me.is.glennorlanes', href: 'https://www.facebook.com/me.is.glennorlanes', icon: <FaFacebook /> },
  { id: 'github', label: 'GitHub', handle: '@Kummorrii', href: 'https://github.com/Kummorrii', icon: <FaGithub /> },
];

function App() {
  const [pageReady, setPageReady] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`app ${pageReady ? 'app--ready' : 'app--intro'}`}>
      <div className="bg-static" aria-hidden="true" />
      <ParticleField />

      <span className="corner-text corner-text--left">Glenn Michael Orlanes</span>
      <a
        className="corner-text corner-text--right"
        href="mailto:glennmichaelorlanes@gmail.com"
        aria-label="Send email to Glenn"
      >
        glennmichaelorlanes@gmail.com
      </a>

      <div className="tile-grid">
        <main className="glass-card tile tile--name" id="hero" role="main">
          <div className="hero__photo-wrap">
            <div className="hero__photo-glow" aria-hidden="true" />
            <img
              className="hero__photo"
              src={`${process.env.PUBLIC_URL}/profile.jpg`}
              alt="Glenn Michael Orlanes"
            />
          </div>

          <div className="hero__text">
            <p className="hero__eyebrow">Personal Website</p>
            <h1 className="hero__name">
              <span className="line1">Glenn</span>
              <span className="line2">Michael Orlanes</span>
            </h1>
            <div className="hero__divider" />
            <p className="hero__tagline">
              &#x22;Νεχ ποσσυμ τεχυμ ωιωερε, νεχ σινε τε.&#x22;
            </p>
          </div>
        </main>

        <ProjectsTile projects={projects} onOpen={() => setProjectsOpen(true)} />

        <div
          className="glass-card tile tile--stack"
          onClick={() => setStackOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStackOpen(true);
            }
          }}
        >
          <span className="tile--stack__label">Stack I Use</span>
          <TechStackTicker />
        </div>

        <AboutTile bio={bio} socialLinks={socialLinks} onOpen={() => setAboutOpen(true)} />
      </div>

      <span className="corner-text corner-text--footer">
        &copy; {new Date().getFullYear()} Glenn Michael Orlanes
      </span>

      {projectsOpen && (
        <ProjectsModal projects={projects} onClose={() => setProjectsOpen(false)} />
      )}

      {aboutOpen && (
        <AboutModal
          bio={bio}
          interests={interests}
          socialLinks={socialLinks}
          email="glennmichaelorlanes@gmail.com"
          onClose={() => setAboutOpen(false)}
        />
      )}

      {stackOpen && <StackModal onClose={() => setStackOpen(false)} />}
    </div>
  );
}

export default App;
