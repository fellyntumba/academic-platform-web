import React from "react";
import "../../../styles-pages/administrateur/main-form/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo / Nom */}
        <div className="footer-brand">
          <img src="/logo.png" alt="Université logo" className='logo'/>
          <h2>DéliberationApp.</h2>
          <p>Votre plateforme de déliberation moderne</p>
        </div>

        {/* Liens / À propos */}
        <div className="footer-links">
          <h3>À propos</h3>
          <ul>
            <li><a href="#about">Notre mission</a></li>
            <li><a href="#team">Équipe</a></li>
            <li><a href="#privacy">Politique de confidentialité</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email : <a href="mailto:contact@universiteapp.com">ulibredekinshasa@gmail.com</a></p>
          <p>Téléphone : +243 97 83 42 861</p>
          <div className="socials">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">X(Twitter)</a>
            <a href="#linkedin">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DéliberationApp. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

