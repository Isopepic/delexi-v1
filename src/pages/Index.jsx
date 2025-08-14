// src/pages/Index.jsx
import { useState } from 'react'

export default function Index() {
  // 1. Texte entré par l'utilisateur
  const [inputText, setInputText] = useState("")

  // 2. Ce qui se passe quand on clique
  function handleClick() {
    alert("Senator, we have a new playlist tu judge ! Link : " + inputText)
  }

  return (
    <div className="content" style={{marginTop: '100px', textAlign: 'center'}}>

        <h1> Delexi </h1>
        <p><em>Veni, Vidi, <strong>Delexi !</strong></em></p>
        <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Senator, please paste your Spotify playlist link here"
            style={{ padding: '10px', width: '300px'}}
            />
        <button
            onClick={handleClick}
            style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer'}}
            >
                <strong>Delexi !</strong>
            </button>
    </div>

  )
}
