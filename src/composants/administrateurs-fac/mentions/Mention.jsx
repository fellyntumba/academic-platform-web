import React, { useEffect, useState } from "react";
import "./Mention.css";
import {
  getCodesMentionsConfig,
  modifierMention,
  creerMention,
  getCodeMentionsBDuniv
} from "./mentionService";

const Mention = ({ nomFaculte }) => {

  const [mentions, setMentions] = useState([]);
  const [newName, setNewName] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [nouveau_code, setNouveau_code] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [codeMention, setCodeMention] = useState("");
  const [mentionsConfig, setMentionsConfig] = useState([]);

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


// Récupérer les mentions configurées pour une université
  const loadMentionsConfig = async () => {
    try { 
      const data = await getCodesMentionsConfig({code_faculte: nomFaculte});

      setMentionsConfig(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      alert(
        "Erreur chargement configuration : " +
          error.message
      );
    }
  };

  // Récupérer les codes mentions depuis la BD
  const loadMentions = async () => {
    if (!nomFaculte) {
      setMentions([]);

      return;
    }

    const result = await getCodeMentionsBDuniv({
      code_faculte: nomFaculte, 
    });

    if (result.success) {
      setMentions(result.data);
    } else {
      setMentions([]);

      showMessage(
        result.message,
        "error"
      );
    }
  };

  useEffect(() => {
    loadMentionsConfig();
    loadMentions();
  }, []);


  // =====================================================
  // CREATION
  // =====================================================
  const handleCreate = async () => {

    if (!codeMention.trim()) {
      return showMessage(
        "Code mention requis",
        "error"
      );
    }

    const result = await creerMention({
      code_mention: codeMention,
      code_faculte: nomFaculte
    });

    if (result.success) {

      showMessage(result.message, "success");

      setNewName("");

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
              value={codeMention}
              onChange={(e) =>
                setCodeMention(e.target.value)
              }
            >
              <option value="">
                Sélectionner un code mention
              </option>

              {mentionsConfig.map((m) => (
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
