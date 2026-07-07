import React, { useEffect, useState } from "react";
import { createCodeFac, getCodeFac } from "./service";
import Data_fac from "../../../../assets/data/data_univ.json";

const Step2 = ({ onNext }) => {

  const [nomFaculte, setNomFaculte] = useState("");
  const [facs, setFacs] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  /* =================
     Charger les facultés
  ==================== */
  const loadFacs = async () => {
    try {
      const data = await getCodeFac();

      // ✅ normalisation (TRÈS IMPORTANT)
      const list = Array.isArray(data)
        ? data
        : data.data || [];

      setFacs(list);
    } catch (error) {
      alert("Erreur chargement codes-facs : " + error.message);
    }
  };

  useEffect(() => {
    loadFacs(); 
  }, []);

  /* ====================
     Ajouter faculté
  ==================== */
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!nomFaculte.trim()) {
      return alert("Veuillez sélectionner un code-fac.");
    }

    try {
      const result = await createCodeFac({
        code_faculte: nomFaculte
      });

      alert(result.message);

      // ✅ AJOUT LOCAL INSTANTANÉ (COMME STEP3)
      setFacs((prev) => [
        ...prev,
        {
          id_faculte: result.faculte?.id_faculte,
          code_faculte: nomFaculte
        }
      ]);

      setNomFaculte("");

    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  return (
    <div className="step-form">
      <h2>Code faculté</h2>

      {showForm ? (
        <form onSubmit={handleAdd}>

          <select
            className="faculte-select"
            value={nomFaculte}
            onChange={(e) => setNomFaculte(e.target.value)}
          >
            <option value="">Sélectionner un code faculté</option>

            {Data_fac.facultes.map((fac) => (
              <option key={fac.code} value={fac.code}>
                {fac.code} - {fac.name}
              </option>
            ))}

          </select>

          <button type="submit">Ajouter</button>

        </form>
      ):(
        <p className="list-items">{message}</p>
      )}
      
      {facs.length > 0 && (
        <ul className="facultes-list horizontal">
          {facs.map((f) => (
            <li key={f.id_faculte}>{f.code_faculte}</li>
          ))}
        </ul>
      )}

      <div className="buttons">
        <button
          onClick={() => {
            if (facs.length === 0) {
              return alert("Veuillez ajouter au moins un code-fac.");
            }
            onNext();
          }}
        >
          Suivant
        </button>
      </div>

    </div>
  );
};

export default Step2;

