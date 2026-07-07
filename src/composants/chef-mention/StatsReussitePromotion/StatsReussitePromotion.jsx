import React, { useState } from "react";
import "./StatsReussitePromotion.css";

/**
 * 🔹 Données simulées
 */
const initialStats = [
  { promotion: "L1", tauxReussite: 78, tauxEchec: 22 },
  { promotion: "L1", tauxReussite: 65, tauxEchec: 35 },
  { promotion: "L2", tauxReussite: 82, tauxEchec: 18 },
  { promotion: "L2", tauxReussite: 70, tauxEchec: 30 },
  { promotion: "L3", tauxReussite: 90, tauxEchec: 10 },
];

const StatsReussitePromotion = () => {
  const [stats] = useState(initialStats);

  return (
    <div className="stats-container fade-in">
      <h2>Taux de réussite / échec par promotion</h2>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Promotion</th>
            <th>Réussite (%)</th>
            <th>Échec (%)</th>
            <th>Visualisation</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, index) => (
            <tr key={index}>
              <td>{s.promotion}</td>
              <td>{s.tauxReussite}</td>
              <td>{s.tauxEchec}</td>
              <td>
                <div className="bar-container">
                  <div
                    className="success-bar"
                    style={{ width: `${s.tauxReussite}%` }}
                  ></div>
                  <div
                    className="failure-bar"
                    style={{ width: `${s.tauxEchec}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsReussitePromotion;
