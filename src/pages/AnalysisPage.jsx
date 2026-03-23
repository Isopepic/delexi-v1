import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import { pdf } from "@react-pdf/renderer";
import SongCard from "../components/SongCard";
import PlaylistPDF from "../components/PlaylistPDF";



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
  const [words, setWords] = useState([]);
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
        setNotes(new Array(data.tracks.length).fill(0));
        setWords(new Array(data.tracks.length).fill(""));
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

  const handleWordChange = (index, value) => {
    setWords((prev) => {
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
  const el = captureRef.current;
  el.classList.add("capturing");
  toPng(el, { pixelRatio: 5 })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "delexi_review.png";
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => console.error("Error generating image:", err))
    .finally(() => el.classList.remove("capturing"));
};




const handleDownloadPDF = async () => {
  if (!playlistData) return;
  const blob = await pdf(
    <PlaylistPDF
      playlistData={playlistData}
      notes={notes}
      words={words}
      globalNote={globalNote}
      average={average}
    />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "delexi_review.pdf";
  link.click();
  URL.revokeObjectURL(url);
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
  <div
    key={track.id || index}
  >
    <SongCard
      index={index + 1}
      title={track.name}
      artist={track.artist}
      duration={msToTime(track.duration_ms)}
      url={track.external_url}
      onNoteChange={(_, value) => handleNoteChange(index, value)}
      word={words[index] ?? ""}
      onWordChange={(value) => handleWordChange(index, value)}
    />
  </div>
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

    </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", paddingBottom: "2rem" }}>
        <button
          onClick={handleSave}
          style={{
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
