import React, { useState } from "react";
import "../../../styles-pages/administrateur/composants-Styles/ListesEtudiants.css";

const Card = ({ title }) => {
  const [showNames, setShowNames] = useState(null);
  const [deliberation, setDeliberation] = useState(false);
  const [saisieOuverte, setSaisieOuverte] = useState(false);

  const handleClick = (subject) => {
    setShowNames(showNames === subject ? null : subject);
  };

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>

      <div className="subjects">
        <div className="subject" onClick={() => handleClick("deliberable")}>
          Etudiants délibérables
        </div>
        {showNames === "deliberable" && (
          <div className="names-box">
            <p>Jean</p>
            <p>Marie</p>
            <p>Paul</p>
            <button className="btn">OK</button>
          </div>
        )}

        <div className="subject" onClick={() => handleClick("non-deliberable")}>
          Etudiants non-délibérables
        </div>
        {showNames === "non-deliberable" && (
          <div className="names-box">
            <p>Alice</p>
            <p>Luc</p>
            <p>Sarah</p>
            <button className="btn">OK</button>
          </div>
        )}
      </div>

      <div className="div-ajouter">
        <p>Ajouter un étudiant à la liste de délibérables</p>
        <select>
          <option value="">Matricule</option>
          <option value="enseignant">Enseignant</option>
          <option value="étudiant">Étudiant</option>
        </select>
        <button className="btn">Ajouter</button>
      </div>
    </div>
  );
};

const ListesEtudiants = () => {
  return (
    <div className="cards-container">
      <Card title="L1" />
      <Card title="L2" />
      <Card title="L3" />
    </div>
  );
};

export default ListesEtudiants;
