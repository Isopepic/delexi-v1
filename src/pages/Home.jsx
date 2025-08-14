import { useState } from 'react';
import { extractPlaylistId } from '../utils';
import background from '../assets/delexi-background.png'; // ✅ ton image logo

function Home() {
  const [inputText, setInputText] = useState('');

  const handleClick = () => {
    const id = extractPlaylistId(inputText);
    if (id) {
      window.location.href = `/analysis?playlist=${id}`;
    } else {
      alert("Invalid Spotify link.");
    }
  };

  return (
  <div className="home-page">
    <img src={background} alt="Background" className="home-bg-img" />

    {/* ✅ Conteneur centré */}
    <div className="home-content">
      <h1>Delexi</h1>
      <p><i>Veni, Vidi, <b>Delexi</b> !</i></p>
      <div className="content">
        <input
          type="text"
          placeholder="Senator, please paste your Spotify playlist URL..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleClick}>Delexi !</button>
      </div>
    </div>
  </div>
);

}

export default Home;
