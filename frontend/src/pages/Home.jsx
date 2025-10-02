import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { title: 'Dyslexia-Friendly Reading', desc: 'Text displayed in OpenDyslexic font, adjustable size, line spacing, and background.' },
  { title: 'AI-Powered Assistance', desc: 'Get reading support and summaries powered by AI.' },
  { title: 'Gamified Learning', desc: 'Learn and practice with interactive games to make reading fun.' },
];

const Home = () => {
  const aboutRef = useRef(null); // ✅ create the ref
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const aboutNode = aboutRef.current; // ✅ store current ref in a variable
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowAbout(true);
      },
      { threshold: 0.2 }
    );

    if (aboutNode) observer.observe(aboutNode);

    return () => {
      if (aboutNode) observer.unobserve(aboutNode); // use the stored variable
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <h1 className="home-title animate-fade-in">Welcome to Readify</h1>

      <p className="home-subtitle animate-fade-in-delay">
        An Inclusive Learning Platform for Dyslexic Students. Explore reading tools, AI-powered assistance, and gamified learning.
      </p>

      <div className="home-buttons animate-slide-up">
        <Link to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-secondary">Register</button>
        </Link>
      </div>

      {/* About / Features Section (revealed on scroll) */}
      <div
        ref={aboutRef}
        className={`about-section ${showAbout ? 'reveal' : 'hidden'}`}
      >
        <h2>About Readify</h2>
        <p className="about-desc">
          Readify is designed to make learning easier and enjoyable for dyslexic students.
          Our platform combines reading tools, AI assistance, and gamified learning for a supportive experience.
        </p>

        <div className="features-container">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="feature-card"
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/login">
          <button className="btn btn-cta animate-bounce">Get Started</button>
        </Link>
      </div>

      {/* Footer */}
      <div className="home-footer">
        © 2025 Readify. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
