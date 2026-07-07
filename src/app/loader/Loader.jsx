import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="spinner"></div>
      <p>Chargement de l'application...</p>
    </div>
  );
};

export default Loader;
