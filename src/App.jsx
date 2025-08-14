import { useEffect, useState } from 'react';
import Home from './pages/Home';
import AnalysisPage from './pages/AnalysisPage';

function App() {
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("playlist");
    if (id) {
      setPlaylistId(id);
      document.body.classList.add("gradient-bg"); // ✅ Ajoute le dégradé
    } else {
      document.body.classList.remove("gradient-bg"); // ❌ Retire-le sur Home
    }
  }, []);

  return (
    <>
      {playlistId ? (
        <AnalysisPage playlistId={playlistId} />
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;
