import React, { useState } from "react";
import { createSuperAdmin } from "./service";

const Step1 = ({ onNext }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);
  

  const handleAdd = async (e) => { 
    e.preventDefault();
    if (!name.trim() || !email.trim()) return alert("Entrez un nom et un email.");
    
    try {
      const result = await createSuperAdmin({ name, email });

      // console.log("Super Admin créé:", result);
      setMessage(result.message); 
      setShowForm(false);
      setName("");
      setEmail("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="step-form">
      <h2>Super administrateur</h2>
      {showForm ? (
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Créer</button>
        </form>
      ) : (
        <p className="list-items">{message}</p>
      )}

      <button
        className="next-btn"
        onClick={() => {
          if (message === "") return alert("Veuillez créer un super administrateur.");
          onNext();
        }}
      >
        Suivant
      </button>
    </div>
  );
};

export default Step1;
//✔️