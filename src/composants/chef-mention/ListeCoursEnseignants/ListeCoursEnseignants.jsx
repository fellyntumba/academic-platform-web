import React, { useState, useEffect } from "react";
import "./ListeCoursEnseignants.css";

import {
  getAffectationsCoursByMention,
  getAnneesAcademiques,
} from "./listeCoursService";

const ListeCoursEnseignants = ({ code_mention }) => {
  const [liste, setListe] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [anneeId, setAnneeId] = useState("");
  const [anneeAcademique, setAnneeAcademique] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorAnnees, setErrorAnnees] = useState("");

  // =========================================================
  // Notifications
  // =========================================================
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
  };

  // =========================================================
  // Libellé d'une année académique
  // =========================================================
  const getLibelleAnnee = (annee) => {
    if (!annee) return "";

    return (
      annee.libelle ||
      annee.nom_annee ||
      annee.annee ||
      (annee.annee_debut != null &&
      annee.annee_fin != null
        ? `${annee.annee_debut}-${annee.annee_fin}`
        : "")
    );
  };

  // =========================================================
  // 1. Charger les années académiques
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const chargerAnnees = async () => {
      setLoadingAnnees(true);
      setErrorAnnees("");

      try {
        // Utilisation de ta fonction existante
        const result = await getAnneesAcademiques();

        if (cancelled) return;

        if (!result?.success) {
          setAnnees([]);
          setAnneeId("");
          setErrorAnnees(
            result?.message ||
              "Impossible de récupérer les années académiques."
          );
          return;
        }

        const anneesDisponibles = Array.isArray(result.data)
          ? result.data
          : [];

        setAnnees(anneesDisponibles);

        // Sélectionner l'année en cours si elle est identifiable.
        // Sinon, sélectionner la première année disponible.
        const anneeEnCours = anneesDisponibles.find(
          (annee) =>
            String(annee.statut || "")
              .trim()
              .toLowerCase() === "en cours"
        );

        const anneeParDefaut =
          anneeEnCours || anneesDisponibles[0];

        setAnneeId(
          anneeParDefaut
            ? String(anneeParDefaut.id_annee)
            : ""
        );
      } catch (error) {
        if (!cancelled) {
          setAnnees([]);
          setAnneeId("");
          setErrorAnnees(
            error.message ||
              "Erreur lors du chargement des années académiques."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAnnees(false);
        }
      }
    };

    chargerAnnees();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // 2. Charger les affectations selon la mention et l'année
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const chargerAffectations = async () => {
      // Ne rien charger tant que les années ne sont pas disponibles.
      if (loadingAnnees) return;

      if (!code_mention || !anneeId) {
        setListe([]);
        setAnneeAcademique("");
        setLoading(false);
        return;
      }

      const anneeSelectionnee = annees.find(
        (annee) =>
          String(annee.id_annee) === String(anneeId)
      );

      const libelleAnnee = getLibelleAnnee(anneeSelectionnee);

      if (!libelleAnnee) {
        setListe([]);
        setAnneeAcademique("");
        setLoading(false);
        showMessage(
          "Le libellé de l'année académique est introuvable.",
          "error"
        );
        return;
      }

      setLoading(true);
      setListe([]);
      setMessage("");
      setMessageType("");
      setAnneeAcademique(libelleAnnee);

      try {
        // Utilisation de ta fonction existante
        const result = await getAffectationsCoursByMention({
          code_mention,
          libelle_annee: libelleAnnee,
        });

        if (cancelled) return;

        if (result?.success) {
          const affectations = Array.isArray(result.data)
            ? result.data
            : [];

          setListe(affectations);
          setAnneeAcademique(
            result.annee_academique || libelleAnnee
          );

          if (affectations.length === 0) {
            showMessage(
              "Aucune affectation trouvée pour cette mention et cette année académique.",
              "error"
            );
          }
        } else {
          setListe([]);
          showMessage(
            result?.message ||
              "Impossible de récupérer les affectations.",
            "error"
          );
        }
      } catch (error) {
        if (!cancelled) {
          setListe([]);
          showMessage(
            error.message ||
              "Erreur lors de la récupération des affectations.",
            "error"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    chargerAffectations();

    return () => {
      cancelled = true;
    };
  }, [code_mention, anneeId, annees, loadingAnnees]);

  // =========================================================
  // 3. Libellé de l'année sélectionnée
  // =========================================================
  const getAnneeLabel = () => {
    const annee = annees.find(
      (item) =>
        String(item.id_annee) === String(anneeId)
    );

    return getLibelleAnnee(annee);
  };

  // =========================================================
  // 4. Regrouper les cours par enseignant, promotion et semestre
  // =========================================================
  const enseignants = {};

  liste.forEach((item, index) => {
    const nomEnseignant =
      item.nom_enseignant || "Enseignant non renseigné";

    if (!enseignants[nomEnseignant]) {
      enseignants[nomEnseignant] = {
        titre: item.titre || "",
        promotions: {},
      };
    }

    const nomPromotion = item.nom_promotion || "Promotion non renseignée";
    const nomSemestre = item.semestre || "Semestre non renseigné";

    const clePromotionSemestre =
      `${nomPromotion} — ${nomSemestre}`;

    if (!enseignants[nomEnseignant].promotions[clePromotionSemestre]) {
      enseignants[nomEnseignant].promotions[clePromotionSemestre] = [];
    }

    enseignants[nomEnseignant].promotions[
      clePromotionSemestre
    ].push({
      nom: item.nom_cours || "Cours sans nom",
      id: item.id_affect || item.id_cours || `${index}`,
    });
  });

  // =========================================================
  // 5. Affichage
  // =========================================================
  return (
    <div className="liste-dropdown fade-in">
      <h2>Affectations des cours par année académique</h2>

      {/* Sélecteur d'année académique */}
      <div className="liste-annee-filter">
        <div className="liste-annee-filter-icon">
          <span>▣</span>
        </div>

        <div className="liste-annee-filter-content">
          <label htmlFor="liste-annee-academique">
            Année académique
          </label>

          <select
            id="liste-annee-academique"
            value={anneeId}
            onChange={(e) => setAnneeId(e.target.value)}
            disabled={loadingAnnees || annees.length === 0}
          >
            <option value="">
              {loadingAnnees
                ? "Chargement des années..."
                : "Sélectionner une année"}
            </option>

            {annees.map((annee) => (
              <option
                key={annee.id_annee}
                value={annee.id_annee}
              >
                {getLibelleAnnee(annee) ||
                  `Année ${annee.id_annee}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Année sélectionnée */}
      {anneeId && (
        <div className="liste-annee-selected">
          <span>Année sélectionnée</span>
          <strong>{getAnneeLabel()}</strong>
        </div>
      )}

      {/* Erreur de chargement des années */}
      {errorAnnees && (
        <div className="notification error">
          {errorAnnees}
        </div>
      )}

      {/* Notifications */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      {/* Chargement des affectations */}
      {loading && (
        <div className="liste-loading">
          <span className="liste-spinner"></span>
          <span>
            Chargement des affectations de {anneeAcademique}...
          </span>
        </div>
      )}

      {/* Résultats */}
      {!loading && !loadingAnnees && !errorAnnees && (
        <>
          <div className="liste-scrollable">
            {Object.keys(enseignants).length > 0 ? (
              Object.entries(enseignants).map(
                ([enseignant, data]) => (
                  <div
                    className="enseignant-card"
                    key={enseignant}
                  >
                    <div className="enseignant-header">
                      {data.titre
                        ? `${data.titre}. `
                        : ""}
                      {enseignant}
                    </div>

                    {Object.entries(data.promotions).map(
                      ([promotion, cours]) => (
                        <div
                          className="promotion-block"
                          key={promotion}
                        >
                          <div className="promotion-title">
                            📘 {promotion}
                          </div>

                          <ul className="cours-list">
                            {cours.map((coursItem) => (
                              <li
                                key={`${promotion}-${coursItem.id}`}
                              >
                                {coursItem.nom}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )
              )
            ) : (
              <div className="empty-list">
                {!code_mention
                  ? "Aucune mention sélectionnée."
                  : !anneeId
                  ? "Sélectionnez une année académique pour afficher les affectations."
                  : "Aucune donnée disponible pour cette année académique."}
              </div>
            )}
          </div>

          <button
            type="button"
            className="download-btn"
            disabled={liste.length === 0}
            onClick={() => {
              const lignes = [
                `Affectations des cours — ${anneeAcademique}`,
                "",
                ...Object.entries(enseignants).flatMap(
                  ([enseignant, data]) => [
                    `${data.titre ? `${data.titre}. ` : ""}${enseignant}`,
                    ...Object.entries(data.promotions).flatMap(
                      ([promotion, cours]) => [
                        `  ${promotion}`,
                        ...cours.map(
                          (coursItem) => `    - ${coursItem.nom}`
                        ),
                      ]
                    ),
                    "",
                  ]
                ),
              ];

              const blob = new Blob(
                ["\uFEFF" + lignes.join("\n")],
                { type: "text/plain;charset=utf-8;" }
              );

              const url = URL.createObjectURL(blob);
              const lien = document.createElement("a");

              lien.href = url;
              lien.download = `affectations-${anneeAcademique.replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
              )}.txt`;

              document.body.appendChild(lien);
              lien.click();
              document.body.removeChild(lien);
              URL.revokeObjectURL(url);
            }}
          >
            📥 Télécharger la liste
          </button>
        </>
      )}
    </div>
  );
};

export default ListeCoursEnseignants;