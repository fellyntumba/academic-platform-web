import React, { useEffect, useState } from "react";
import "./StatsReussiteFaculte.css";

const StatsReussiteFaculte = () => {
  const [stats, setStats] = useState([]);
  const [totalUni, setTotalUni] = useState({ reussite: 0, echec: 0 });

  useEffect(() => {
    // 🔹 Simulation API
    const data = [
      { faculte: "Faculté des Sciences", reussite: 72, echec: 28 },
      { faculte: "Faculté de Droit", reussite: 64, echec: 36 },
      { faculte: "Faculté de Médecine", reussite: 81, echec: 19 },
    ];
    setStats(data);

    // 🔹 Calcul taux global université
    const total = data.reduce(
      (acc, f) => {
        acc.reussite += f.reussite;
        acc.echec += f.echec;
        return acc;
      },
      { reussite: 0, echec: 0 }
    );

    setTotalUni({
      reussite: (total.reussite / data.length).toFixed(1),
      echec: (total.echec / data.length).toFixed(1),
    });
  }, []);

  return (
    <div className="stats-wrapper">
      <h2>Taux de réussite / échec par faculté</h2>

      {/* 🔹 Global Université */}
      <div className="stats-card global">
        <h3>Université</h3>
        <div className="uni-values">
          <span className="success">Réussite : {totalUni.reussite}%</span>
          <span className="fail">Échec : {totalUni.echec}%</span>
        </div>
      </div>

      {/* 🔹 Facultés */}
      {stats.map((item, index) => (
        <div key={index} className="stats-card">
          <h3>{item.faculte}</h3>
          <div className="uni-values">
            <span className="success">Réussite : {item.reussite}%</span>
            <span className="fail">Échec : {item.echec}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsReussiteFaculte;
