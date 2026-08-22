import React, { useEffect, useState } from "react";
import "./EtudiantsFaculte.css";

const EtudiantsFaculte = () => {
  const [data, setData] = useState([]);
  const [totalUniversite, setTotalUniversite] = useState({
    total: 0,
    reg: 0,
    paye: 0,
  });

  useEffect(() => {
    // 🔹 Données simulées par faculté
    const facultes = [
      { faculte: "Faculté des Sciences", total: 1240, reg: 1100, paye: 950 },
      { faculte: "Faculté de Droit", total: 980, reg: 850, paye: 800 },
      { faculte: "Faculté de Médecine", total: 1560, reg: 1450, paye: 1400 },
      { faculte: "Faculté d'Économie", total: 760, reg: 700, paye: 650 },
    ];
    setData(facultes);

    // 🔹 Calcul total université
    const total = facultes.reduce(
      (acc, f) => {
        acc.total += f.total;
        acc.reg += f.reg;
        acc.paye += f.paye;
        return acc;
      },
      { total: 0, reg: 0, paye: 0 }
    );
    setTotalUniversite(total);
  }, []);

  return (
    <div className="students-stats-wrapper">
      <h2>Statistiques des étudiants par faculté</h2>

      {/* 🔹 Total université */}
      <div className="student-total-card">
        <span className="total-label">Total Université</span>
        <div className="total-values">
          <span>Total : {totalUniversite.total}</span>
          <span>Réguliers : {totalUniversite.reg}</span>
          <span>Frais payés : {totalUniversite.paye}</span>
        </div>
      </div>

      {/* 🔹 Liste facultés */}
      <div className="faculty-list">
        {data.map((item, index) => (
          <div key={index} className="faculty-card">
            <span className="faculty-name">{item.faculte}</span>
            <div className="faculty-values">
              <span className="value total">Total : {item.total}</span>
              <span className="value reg">Réguliers : {item.reg}</span>
              <span className="value paye">Frais payés : {item.paye}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtudiantsFaculte;
