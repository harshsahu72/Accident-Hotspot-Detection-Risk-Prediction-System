"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";
import { hotspotZones } from "@/data/accidents";
import type { HotspotZone } from "@/types";

type SortField = "mlRiskScore" | "accidentCount" | "fatalityCount" | "kdeScore" | "giStarZ";
type FilterOption = "all" | "official" | "predicted" | "critical";

export default function HotspotTable() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("mlRiskScore");
  const [sortAsc, setSortAsc] = useState(false);

  const officialCount = useMemo(() => hotspotZones.filter((z) => z.isOfficialBlackSpot).length, []);
  const predictedCount = useMemo(() => hotspotZones.filter((z) => !z.isOfficialBlackSpot).length, []);
  const criticalCount = useMemo(() => hotspotZones.filter((z) => z.riskLevel === "critical").length, []);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    return hotspotZones
      .filter((zone) => {
        if (filter === "official" && !zone.isOfficialBlackSpot) return false;
        if (filter === "predicted" && zone.isOfficialBlackSpot) return false;
        if (filter === "critical" && zone.riskLevel !== "critical") return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            zone.name.toLowerCase().includes(q) ||
            zone.roadSegment.toLowerCase().includes(q) ||
            zone.topFactors.some((f) => f.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [filter, search, sortBy, sortAsc]);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">📋 Black Spot Registry</div>
          <h2 className="section-title">
            Identified Hotspots & Predicted Risk Zones
          </h2>
          <p className="section-subtitle">
            12 officially identified black spots (2024–25 review) plus 3
            ML-predicted emerging risk zones ranked by composite risk score
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className={`map-filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Zones ({hotspotZones.length})
            </button>
            <button
              className={`map-filter-btn ${filter === "official" ? "active" : ""}`}
              onClick={() => setFilter("official")}
            >
              ⚫ Official Black Spots ({officialCount})
            </button>
            <button
              className={`map-filter-btn ${filter === "predicted" ? "active" : ""}`}
              onClick={() => setFilter("predicted")}
            >
              🤖 ML Predicted ({predictedCount})
            </button>
            <button
              className={`map-filter-btn ${filter === "critical" ? "active" : ""}`}
              onClick={() => setFilter("critical")}
            >
              🔴 Critical Risk ({criticalCount})
            </button>
          </div>

          <div
            style={{
              position: "relative",
              minWidth: 260,
              maxWidth: 360,
              flex: 1,
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search location or road..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-secondary)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <motion.div
          className="hotspot-table-wrapper"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ maxHeight: 540, overflowY: "auto" }}
        >
          <table className="hotspot-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Road Segment</th>
                <th>Risk Level</th>
                <th
                  onClick={() => handleSort("mlRiskScore")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by ML Score"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    ML Score <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("accidentCount")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by Accidents"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Accidents <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("fatalityCount")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by Fatalities"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Fatalities <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("kdeScore")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by KDE Score"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    KDE Score <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("giStarZ")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by Gi* Z-score"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Gi* Z-Score <ArrowUpDown size={12} />
                  </span>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                    No hotspots match the filter &quot;{search}&quot;
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((zone: HotspotZone) => (
                  <tr key={zone.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {zone.name}
                    </td>
                    <td>{zone.roadSegment}</td>
                    <td>
                      <span className={`risk-badge ${zone.riskLevel}`}>
                        {zone.riskLevel}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          className="mono"
                          style={{
                            fontWeight: 700,
                            color:
                              zone.mlRiskScore >= 80
                                ? "var(--critical)"
                                : zone.mlRiskScore >= 60
                                ? "var(--high)"
                                : "var(--moderate)",
                          }}
                        >
                          {zone.mlRiskScore}
                        </span>
                        <div className="risk-score-bar" style={{ width: 60 }}>
                          <div
                            className="risk-score-fill"
                            style={{
                              width: `${zone.mlRiskScore}%`,
                              background:
                                zone.mlRiskScore >= 80
                                  ? "var(--critical)"
                                  : zone.mlRiskScore >= 60
                                  ? "var(--high)"
                                  : "var(--moderate)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>
                      {zone.accidentCount}
                    </td>
                    <td
                      className="mono"
                      style={{ fontWeight: 600, color: "var(--critical)" }}
                    >
                      {zone.fatalityCount}
                    </td>
                    <td className="mono">{zone.kdeScore.toFixed(2)}</td>
                    <td className="mono">{zone.giStarZ.toFixed(2)}</td>
                    <td>
                      {zone.isOfficialBlackSpot ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            background: "var(--critical-bg)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "var(--radius-full)",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--critical)",
                          }}
                        >
                          ⚫ Official
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            background: "rgba(6,182,212,0.1)",
                            border: "1px solid rgba(6,182,212,0.3)",
                            borderRadius: "var(--radius-full)",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--accent-cyan)",
                          }}
                        >
                          🤖 Predicted
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        <div
          style={{
            marginTop: 20,
            padding: "14px 20px",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>💡</span>
          <div>
            <strong style={{ color: "var(--text-primary)" }}>
              How to read this table:
            </strong>{" "}
            <strong>ML Score</strong> is the composite risk prediction (0–100) from
            our XGBoost model. <strong>KDE Score</strong> measures accident density
            (0–1). <strong>Gi* Z-Score</strong> confirms statistical clustering
            significance (z &gt; 1.96 = p &lt; 0.05). Zones marked{" "}
            <strong>&quot;Predicted&quot;</strong> are not yet officially identified but
            share the risk profile of known black spots.
          </div>
        </div>
      </div>
    </div>
  );
}
