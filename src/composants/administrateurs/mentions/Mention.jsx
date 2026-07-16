import React, { useEffect, useState } from "react";
import "./Mention.css";
import {
  getMentions,
  modifierMention,
  creerMention
} from "./mentionService";

import Data_fac from "../../../assets/data/data_univ.json";

const Mention = ({ nomFaculte }) => {

  const [mentions, setMentions] = useState([]);
  const [newName, setNewName] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [nouveau_code, setNouveau_code] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const showMessage = (msg, type = "success") => {

    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {

      setMessage("");
      setMessageType("");

    }, 4000);
  };

  // =====================================================
  // CHARGER MENTIONS
  // =====================================================

  const loadMentions = async () => {

    const result = await getMentions({
      code_faculte: nomFaculte
    });

    if (result.success) {

      setMentions(result.data);

    } else {

      showMessage(result.message, "error");
    }
  };

  useEffect(() => {
    loadMentions();
  }, []);

  // =====================================================
  // CREATION
  // =====================================================

  const handleCreate = async () => {

    if (!newName.trim()) {
      return showMessage(
        "Code mention requis",
        "error"
      );
    }

    const result = await creerMention({
      code_mention: newName,
      code_faculte: nomFaculte
    });

    if (result.success) {

      showMessage(result.message, "success");

      setNewName("");

      loadMentions();

    } else {

      showMessage(result.message, "error");
    }
  };

  // =====================================================
  // SELECTION
  // =====================================================

  const handleSelect = (id) => {

    const mention = mentions.find(
      (m) => m.id_mention === Number(id)
    );

    setSelectedId(id);

    setNouveau_code(
      mention?.code_mention || ""
    );
  };

  // =====================================================
  // MODIFICATION
  // =====================================================

  const handleUpdate = async () => {

    if (!selectedId) {
      return showMessage(
        "Sélectionnez une mention",
        "error"
      );
    }

    if (!nouveau_code.trim()) {
      return showMessage(
        "Nouveau code requis",
        "error"
      );
    }

    const mention = mentions.find(
      (m) => m.id_mention === Number(selectedId)
    );

    const result = await modifierMention({
      ancien_code: mention.code_mention,
      nouveau_code
    });

    if (result.success) {

      showMessage(result.message, "success");

      loadMentions();

      setSelectedId("");
      setNouveau_code("");

    } else {

      showMessage(result.message, "error");
    }
  };

  return (

    <div className="mentions-wrapper">

      <h2>Gestion des mentions</h2>

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="top-row">

        {/* =========================================
            CREATION
        ========================================= */}

        <div className="mention-card">

          <h3>Créer un code mention</h3>

          <select
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          >

            <option value="">
              Sélectionner un code mention
            </option>

            {Data_fac.facultes
              .find((fac) => fac.code === nomFaculte)
              ?.mentions.map((m) => (

                <option
                  key={m.code}
                  value={m.code}
                >
                  {m.code} - {m.nom}
                </option>

              ))}
          </select>

          <button onClick={handleCreate}>
            Créer
          </button>

        </div>

        {/* =========================================
            MODIFICATION
        ========================================= */}

        <div className="mention-card">

          <h3>Modifier un code mention</h3>

          <select
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
          >

            <option value="">
              -- Sélectionner une mention --
            </option>

            {mentions.map((m) => (

              <option
                key={m.id_mention}
                value={m.id_mention}
              >
                {m.code_mention}
              </option>

            ))}

          </select>

          {selectedId && (
            <>
              <input
                type="text"
                placeholder="Nouveau code mention"
                value={nouveau_code}
                onChange={(e) =>
                  setNouveau_code(e.target.value)
                }
              />

              <button onClick={handleUpdate}>
                Modifier
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Mention;
