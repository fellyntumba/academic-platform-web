import React, { useState } from "react";
import "./Documents.css";

const Documents = ({ id_enseignant, annee }) => {

  const [file, setFile] = useState(null);
  const [titre, setTitre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !titre) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    console.log({
      titre,
      file,
      id_enseignant,
      annee
    });

    alert("Document prêt à être envoyé ✔️");
  };

  return (
    <div className="documents-container">

      <h2>Envoyer les documents</h2>

      <form className="documents-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Titre du document</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex: Support de cours"
          />
        </div>

        <div className="form-group">
          <label>Fichier</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="upload-btn">
          Envoyer
        </button>

      </form>

    </div>
  );
};

export default Documents;