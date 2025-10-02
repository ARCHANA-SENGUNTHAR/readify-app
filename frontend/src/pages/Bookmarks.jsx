import React, { useEffect, useState } from 'react';

const Bookmarks = () => {
  const [savedTexts, setSavedTexts] = useState([]);

  useEffect(() => {
    const texts = JSON.parse(localStorage.getItem('savedTexts')) || [];
    setSavedTexts(texts);
  }, []);

  const handleDelete = (id) => {
    const updated = savedTexts.filter(item => item.id !== id);
    setSavedTexts(updated);
    localStorage.setItem('savedTexts', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📑 Your Bookmarked Texts</h2>
      {savedTexts.length === 0 ? (
        <p>No bookmarks yet. Go back and save some text!</p>
      ) : (
        <ul>
          {savedTexts.map(item => (
            <li key={item.id} style={{ marginBottom: '15px' }}>
              <pre style={{
                background: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                whiteSpace: 'pre-wrap'
              }}>
                {item.text}
              </pre>
              <button onClick={() => handleDelete(item.id)}>❌ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;
