import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReadEase.css';

const fonts = [
  { name: 'Default', family: 'Arial, sans-serif' },
  { name: 'OpenDyslexic', family: "'OpenDyslexic', sans-serif" },
  { name: 'Sans-serif', family: 'Verdana, sans-serif' },
];

const ReadEase = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [font, setFont] = useState(fonts[0].family);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bgColor, setBgColor] = useState('#f9f0ff');
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [localSaved, setLocalSaved] = useState([]);
  const [dbSaved, setDbSaved] = useState([]);
  const [expandedLocal, setExpandedLocal] = useState([]);
  const [expandedDB, setExpandedDB] = useState([]);

  const words = text.split(/\s+/);
  const utteranceRef = useRef(null);
  const currentWordRef = useRef(null);

  // Fetch local bookmarks
  useEffect(() => {
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
    setLocalSaved(savedTexts);
  }, []);

  // Fetch DB bookmarks
  useEffect(() => {
    const fetchDB = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/texts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDbSaved(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDB();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setText(e.target.result);
    reader.readAsText(file);
  };

  const handlePlay = () => {
    if (!window.speechSynthesis || !text || isPlaying) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    setIsPlaying(true);
    let wordIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        setTimeout(() => {
          currentWordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
        wordIndex++;
      }
    };

    utterance.onend = () => {
      setCurrentWordIndex(-1);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setCurrentWordIndex(-1);
    setIsPlaying(false);
  };

  const handleSaveLocal = () => {
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const newText = { id: Date.now(), text };
    savedTexts.push(newText);
    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
    setLocalSaved(savedTexts);
    alert('Text saved locally!');
  };

  const handleSaveDB = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to save bookmarks!');
        return;
      }

      const title = prompt('Enter a title for this text:');
      if (!title) return;

      await axios.post(
        'http://localhost:5000/api/texts/save',
        { title, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Text saved to your bookmarks!');
      const res = await axios.get('http://localhost:5000/api/texts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbSaved(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to save text');
    }
  };

  const toggleExpand = (id, type) => {
    if (type === 'local') {
      setExpandedLocal((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setExpandedDB((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className="read-ease-page">
      <div className="read-ease-card">
        <div className="header">
          <h2>ReadEase - Dyslexia Friendly Reading</h2>
          <button className="btn-purple logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <textarea
          className="text-input"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="controls">
          <label>
            Font:
            <select onChange={(e) => setFont(e.target.value)} value={font}>
              {fonts.map((f) => (
                <option key={f.name} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Font Size:
            <input
              type="number"
              min="12"
              max="36"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </label>

          <label>
            Line Height:
            <input
              type="number"
              step="0.1"
              min="1"
              max="3"
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
            />
          </label>

          <label>
            Background:
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>

          <label>
            Upload File:
            <input type="file" accept=".txt" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="tts-buttons">
          <button className="btn-purple" onClick={handlePlay} disabled={isPlaying}>
            Play
          </button>
          <button className="btn-purple" onClick={handlePause}>
            Pause
          </button>
          <button className="btn-purple" onClick={handleResume}>
            Resume
          </button>
          <button className="btn-purple" onClick={handleReset}>
            Reset
          </button>

          <button className="btn-purple" onClick={handleSaveLocal}>
            Save Local
          </button>
          <button className="btn-purple" onClick={handleSaveDB}>
            Save to DB
          </button>
        </div>

        <div
          className="display-text"
          style={{ fontFamily: font, fontSize: `${fontSize}px`, lineHeight, backgroundColor: bgColor }}
        >
          {words.map((word, idx) => (
            <span
              key={idx}
              ref={idx === currentWordIndex ? currentWordRef : null}
              style={{
                backgroundColor: idx === currentWordIndex ? 'yellow' : 'transparent',
                marginRight: '4px',
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="local-saved-container">
          <h3>📌 Locally Saved Texts</h3>
          {localSaved.length === 0 ? (
            <p>No local saves yet</p>
          ) : (
            localSaved.map((item) => (
              <div
                key={item.id}
                className={`saved-card ${expandedLocal.includes(item.id) ? 'expanded' : ''}`}
              >
                <p>
                  {expandedLocal.includes(item.id)
                    ? item.text
                    : item.text.slice(0, 150) + (item.text.length > 150 ? '...' : '')}
                </p>
                {item.text.length > 150 && (
                  <button onClick={() => toggleExpand(item.id, 'local')}>
                    {expandedLocal.includes(item.id) ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="local-saved-container">
          <h3>☁️ Saved in DB</h3>
          {dbSaved.length === 0 ? (
            <p>No DB saves yet</p>
          ) : (
            dbSaved.map((item) => (
              <div
                key={item._id}
                className={`saved-card ${expandedDB.includes(item._id) ? 'expanded' : ''}`}
              >
                <strong>{item.title}</strong>
                <p>
                  {expandedDB.includes(item._id)
                    ? item.content
                    : item.content.slice(0, 150) + (item.content.length > 150 ? '...' : '')}
                </p>
                {item.content.length > 150 && (
                  <button onClick={() => toggleExpand(item._id, 'db')}>
                    {expandedDB.includes(item._id) ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadEase;
