import React, { useState } from "react";
import { Clock3 } from "lucide-react";
import "./SongCard.css";

function SongCard({ index, title, artist, duration, onNoteChange }) {
  const [note, setNote] = useState(0);
  const [word, setWord] = useState("");

  const getColorFromNote = (n) => {
    const scale = [
      "#8b0000", // 0-1 : dark red
      "#b22222", // 2-3 : firebrick
      "#ff8c00", // 4 : dark orange
      "#ffd700", // 5-6 : gold
      "#9acd32", // 7-8 : yellowgreen
      "#006400", // 9-10 : dark green
    ];
    if (n <= 1) return scale[0];
    if (n <= 3) return scale[1];
    if (n === 4) return scale[2];
    if (n <= 6) return scale[3];
    if (n <= 8) return scale[4];
    return scale[5];
  };

  const labelColor = getColorFromNote(note);

  return (
    <div style={{
      display: "flex",
  flexDirection: "column",
  alignItems: "center",       // centre le contenu
  width: "100%",              // s'adapte à l'écran
  boxSizing: "border-box", 
    }}>
    <div className="song-card" 
    style={{
  breakInside: "avoid",
  pageBreakInside: "avoid",
  padding: "1rem",
  borderRadius: "12px",
}}
>
      {/* Étiquette colorée à gauche */}
      <div className="label-color" style={{ backgroundColor: labelColor }} />

      <div className="song-content">
        <div className="song-title">{title}</div>
        <div className="song-artist">{artist}</div>
        <div className="song-duration">
          <Clock3 size={16} style={{ marginRight: "5px" }} />
          {duration}
        </div>

        <div className="rating-row">
          {/* Note sur 10 */}
          <div className="note-section">
            <label className="note-label">Grade :</label>
            <div className="note-input-wrapper">
              <button
                className="note-button"
                onClick={() => {
                  const newNote = Math.max(0, note - 1);
                  setNote(newNote);
                  onNoteChange(index, newNote); // 🔥 important
                }}
              >
                –
              </button>
              <input
                type="number"
                min="0"
                max="10"
                value={note}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    const clamped = Math.min(10, Math.max(0, value));
                    setNote(clamped);
                    onNoteChange(index, clamped);
                  }
                }}
                className="note-input"
              />
              <button
                className="note-button"
                onClick={() => {
                  const newNote = Math.min(10, note + 1);
                  setNote(newNote);
                  onNoteChange(index, newNote); // 🔥 important
                }}
              >
                +
              </button>
              <span className="note-outof">/10</span>
            </div>
          </div>
          </div>

          {/* Word en italique direct */}
          <div className="word-section">
            <input
              type="text"
              placeholder="Describe the song in 1 word"
              maxLength={15}
              value={word}
              onChange={(e) => {
                const val = e.target.value;
                if (!val.includes(" ")) setWord(val);
              }}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #ccc",
                fontStyle: "italic",
                color: "#2c2c2c",
                fontWeight: "bold",
                outline: "none",
                textAlign: "right",
              }}
            />
            <div
              style={{
                marginTop: "0.3rem",
                textAlign: "right",
                fontStyle: "italic",
                fontWeight: "bold",
                color: "#bdb3b3ff",
                fontSize: "25px",
              }}
            >
              {word && `"${word}"`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongCard;
