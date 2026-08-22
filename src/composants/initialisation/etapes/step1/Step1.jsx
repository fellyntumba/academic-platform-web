import React, { useState } from "react";
import { createSga } from "./service";

const Step1 = ({ onNext }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [titre, setTitre] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);
  

  const handleAdd = async (e) => { 
    e.preventDefault();
    if (!name.trim() || !email.trim()) return alert("Entrez un nom et un email.");
    
    try {
      const result = await createSga({ name, email, telephone, titre});

      // console.log("Super Admin créé:", result);
      setMessage(result.message); 
      setShowForm(false);
      setName("");
      setEmail("");
      setTelephone("");
      setTitre("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="step-form">
      <h2>Secrétaire général académique</h2>
      {showForm ? (
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="telephone"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          <input
            name="titre"
            placeholder="Titre (Dr, Prof, etc.)"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          <button type="submit">Créer</button>
        </form>
      ) : (
        <p className="list-items">{message}</p>
      )}

      <button
        className="next-btn"
        onClick={() => {
          if (message === "") return alert("Veuillez créer le compte du Secrétaire général académique.");
          onNext();
        }}
      >
        Suivant
      </button>
    </div>
  );
};

export default Step1;


//  window.location.replace("/");