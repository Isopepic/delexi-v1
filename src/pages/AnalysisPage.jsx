import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import SongCard from "../components/SongCard";
import html2pdf from 'html2pdf.js';


function msToTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function AnalysisPage({ playlistId }) {
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalNote, setGlobalNote] = useState("");
  const [notes, setNotes] = useState([]);
  const captureRef = useRef(null);

  const PROXY_BASE = "https://delexi-proxy.onrender.com";

  useEffect(() => {
    if (!playlistId) {
      setError("No playlist ID provided.");
      setLoading(false);
      return;
    }

    async function fetchPlaylist() {
      try {
        const res = await fetch(`${PROXY_BASE}/api/playlist/${playlistId}`);
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        setPlaylistData(data);
        setNotes(new Array(data.tracks.length).fill(0)); // initialise les notes à 0
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [playlistId]);

  const handleNoteChange = (index, value) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const average =
    notes.length > 0
      ? (notes.reduce((sum, n) => sum + n, 0) / notes.length).toFixed(1)
      : "N/A";

  const handleSave = () => {
  if (!captureRef.current) return;

  const node = captureRef.current;

  // Cloner le contenu
  const clone = node.cloneNode(true);
  clone.style.width = "800px";                // 📏 Largeur fixe pour capture haute qualité
  clone.style.maxWidth = "none";              // ✅ Supprime les limitations
  clone.style.margin = "0";                   // 🔧 Supprime centrage si besoin
  clone.style.padding = "2rem";
  clone.style.fontSize = "1.5rem";

  // Créer un conteneur temporaire invisible
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";            
  container.style.left = "-9999px";
  container.appendChild(clone);
  document.body.appendChild(container);

  // Attendre que le DOM s’affiche avant capture
  requestAnimationFrame(() => {
    toPng(clone, {
      pixelRatio: 2.5,                        
      backgroundColor: "#000",                 
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "playlistreview.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Erreur de génération :", err);
      })
      .finally(() => {
        document.body.removeChild(container);  
      });
  });
};


const handleDownloadPDF = () => {
  if (!captureRef.current) return;

  const element = captureRef.current;

  element.classList.add("pdf-dark-mode");

  const opt = {
    margin: 0.5,
    filename: 'playlistreview.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    element.classList.remove("pdf-dark-mode");
  });
};





  if (loading) return <p>Loading playlist…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!playlistData) return <p>No data found.</p>;

  return (
    <div style={{
      maxWidth: "600px",           
  margin: "0 auto",           
  padding: "1rem",  
    }}>
    <div
  ref={captureRef}
  className="analysis-page"
  style={{
       
    padding: "2rem",
    textAlign: "center",
  }}
>
      <h2>🎧 {playlistData.name ?? "Untitled Playlist"}</h2>
      {playlistData.owner && <p>by {playlistData.owner}</p>}

      {playlistData.image && (
        <img
          src={playlistData.image}
          alt="Cover"
          style={{ maxWidth: "200px", borderRadius: "12px", margin: "1rem 0" }}
        />
      )}

      <div className="song-list" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {playlistData.tracks?.map((track, index) => (
          <SongCard
            key={track.id || index}
            index={index + 1}
            title={track.name}
            artist={track.artist}
            duration={msToTime(track.duration_ms)}
            url={track.external_url}
            onNoteChange={handleNoteChange}
          />
        ))}
      </div>

      {/* Note moyenne et appréciation */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.5rem" }}>Average grade: <b>{average}</b>/10</h3>
        <textarea
          placeholder="General appreciation of the playlist…"
          value={globalNote}
          onChange={(e) => setGlobalNote(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "80px",
            fontSize: "1rem",
            padding: "0.5rem",
            marginTop: "1rem",
            borderRadius: "8px",
            border: "1px solid #aaa",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Save as image
      </button>

      <button
  onClick={handleDownloadPDF}
  style={{
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#222",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Download as PDF
</button>

    </div>
    </div>
  );
}

export default AnalysisPage;
