import React, { useEffect, useState } from "react";
import "./SuperAdminManager.css";
import {
  creerSuperAdmin,
  desactiverSuperAdmin,
  getSuperAdminsActifs,
} from "./superAdminManagerService";

const SuperAdminManager = () => {
  const [mode, setMode] = useState("deactivate");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [selectedAdminEmail, setSelectedAdminEmail] = useState("");

  const [activeAdmins, setActiveAdmins] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    // disparaît automatiquement après 4 secondes
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const loadAdmins = async () => {
    const result = await getSuperAdminsActifs();
    if (result.success) setActiveAdmins(result.data);
    else showMessage(result.message, "error");
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!nom.trim() || !email.trim()) {
      showMessage("Veuillez remplir le nom et l'email.", "error");
      return;
    }

    const result = await creerSuperAdmin({ nom, email });

    if (result.success) {
      showMessage(result.message, "success");
      setNom("");
      setEmail("");
      loadAdmins();
    } else {
      showMessage(result.message, "error");
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();

    if (!selectedAdminId) {
      showMessage("Veuillez sélectionner un super administrateur.", "error");
      return;
    }

    const admin = activeAdmins.find(
      (a) => a.id_admin === parseInt(selectedAdminId)
    );

    if (!admin) {
      showMessage("Administrateur non trouvé.", "error");
      return;
    }

    const result = await desactiverSuperAdmin({
      nom: admin.nom,
      email: admin.email,
    });

    if (result.success) {
      showMessage(result.message, "success");
      setSelectedAdminId("");
      setSelectedAdminEmail("");
      loadAdmins();
    } else {
      showMessage(result.message, "error");
    }
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedAdminId(id);

    const admin = activeAdmins.find(
      (a) => a.id_admin === parseInt(id)
    );

    setSelectedAdminEmail(admin ? admin.email : "");
  };

  return (
    <div className="super-admin-wrapper">
      
      {/* 🔹 Carte */}
      <div className="super-admin-manager">
        <h2>Gestion Super Administrateurs</h2>

        <div className="mode-switch">
          <button
            className={mode === "deactivate" ? "active danger-btn" : ""}
            onClick={() => setMode("deactivate")}
          >
            Désactiver
          </button>
          <button
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Créer
          </button>
        </div>

        {mode === "deactivate" && (
          <form className="form-section" onSubmit={handleDeactivate}>
            <select
              value={selectedAdminId}
              onChange={handleSelectChange}
              required
            >
              <option value="">Sélectionner un super administrateur</option>
              {activeAdmins.map((a) => (
                <option key={a.id_admin} value={a.id_admin}>
                  {a.nom}
                </option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Email"
              value={selectedAdminEmail}
              readOnly
            />

            <button type="submit" className="danger-btn">
              Désactiver super administrateur
            </button>
          </form>
        )}

        {mode === "create" && (
          <form className="form-section" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Créer super administrateur</button>
          </form>
        )}
      </div>

      {/* 🔹 Notification en dehors de la carte */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SuperAdminManager;
