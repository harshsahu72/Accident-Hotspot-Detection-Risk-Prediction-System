"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Brain, Award, Target } from "lucide-react";
import {
  modelMetrics,
  featureImportance,
  roadSegments,
} from "@/data/accidents";

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(17,24,39,0.95)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 10,
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{typeof p.value === 'number' ? p.value.toFixed(3) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MLSection() {
  const [selectedSegment, setSelectedSegment] = useState(roadSegments[0]);

  const bestModel = modelMetrics.reduce((a, b) =>
    a.accuracy > b.accuracy ? a : b
  );

  const radarMap = useMemo(() => {
    const map: Record<string, { Accuracy: number; Precision: number; Recall: number; "F1 Score": number; "AUC-ROC": number }> = {};
    modelMetrics.forEach((m) => {
      let key = "XGB";
      if (m.model.includes("Random")) key = "RF";
      else if (m.model.includes("Logistic")) key = "LR";
      else if (m.model.includes("SVM")) key = "SVM";
      else if (m.model.includes("XGB")) key = "XGB";
      map[key] = {
        Accuracy: m.accuracy * 100,
        Precision: m.precision * 100,
        Recall: m.recall * 100,
        "F1 Score": m.f1Score * 100,
        "AUC-ROC": m.auc * 100,
      };
    });
    return map;
  }, []);

  const radarData = useMemo(() => [
    { metric: "Accuracy", RF: radarMap.RF?.Accuracy ?? 0, XGB: radarMap.XGB?.Accuracy ?? 0, LR: radarMap.LR?.Accuracy ?? 0, SVM: radarMap.SVM?.Accuracy ?? 0 },
    { metric: "Precision", RF: radarMap.RF?.Precision ?? 0, XGB: radarMap.XGB?.Precision ?? 0, LR: radarMap.LR?.Precision ?? 0, SVM: radarMap.SVM?.Precision ?? 0 },
    { metric: "Recall", RF: radarMap.RF?.Recall ?? 0, XGB: radarMap.XGB?.Recall ?? 0, LR: radarMap.LR?.Recall ?? 0, SVM: radarMap.SVM?.Recall ?? 0 },
    { metric: "F1 Score", RF: radarMap.RF?.["F1 Score"] ?? 0, XGB: radarMap.XGB?.["F1 Score"] ?? 0, LR: radarMap.LR?.["F1 Score"] ?? 0, SVM: radarMap.SVM?.["F1 Score"] ?? 0 },
    { metric: "AUC-ROC", RF: radarMap.RF?.["AUC-ROC"] ?? 0, XGB: radarMap.XGB?.["AUC-ROC"] ?? 0, LR: radarMap.LR?.["AUC-ROC"] ?? 0, SVM: radarMap.SVM?.["AUC-ROC"] ?? 0 },
  ], [radarMap]);

  return (
    <div className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <Brain size={14} />
            Machine Learning
          </div>
          <h2 className="section-title">Risk Prediction & Model Performance</h2>
          <p className="section-subtitle">
            XGBoost outperforms Random Forest, SVM, and Logistic Regression for
            road-segment risk scoring, with SHAP-based interpretability
          </p>
        </div>

        {/* Model comparison cards */}
        <div className="model-grid" style={{ marginBottom: 40 }}>
          {modelMetrics.map((m, i) => (
            <motion.div
              key={m.model}
              className={`model-card ${m.model === bestModel.model ? "best" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                {m.model === bestModel.model && (
                  <Award size={20} style={{ color: "var(--accent-amber)" }} />
                )}
                <h3 className="model-name">{m.model}</h3>
              </div>
              {m.model === bestModel.model && (
                <div className="model-tag">Best Performing Model</div>
              )}
              <div className="metric-row">
                <span className="metric-label">Accuracy</span>
                <span
                  className="metric-value"
                  style={{
                    color:
                      m.accuracy > 0.85
                        ? "var(--low)"
                        : m.accuracy > 0.75
                        ? "var(--moderate)"
                        : "var(--high)",
                  }}
                >
                  {(m.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Precision</span>
                <span className="metric-value">
                  {(m.precision * 100).toFixed(1)}%
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Recall</span>
                <span className="metric-value">
                  {(m.recall * 100).toFixed(1)}%
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">F1 Score</span>
                <span className="metric-value">
                  {(m.f1Score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">AUC-ROC</span>
                <span
                  className="metric-value"
                  style={{ color: "var(--accent-indigo-light)" }}
                >
                  {m.auc.toFixed(3)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Importance + Model Radar */}
        <div className="ml-charts-grid">
          <motion.div
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="chart-title">Feature Importance (XGBoost)</h3>
            <p className="chart-subtitle">
              Top features by Gini importance with SHAP mean values
            </p>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={featureImportance}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.08)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  domain={[0, 0.2]}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#64748b"
                  fontSize={11}
                  width={180}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="Gini Importance" radius={[0, 4, 4, 0]}>
                  {featureImportance.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${240 + i * 12}, 70%, ${55 + i * 3}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="chart-title">Model Comparison Radar</h3>
            <p className="chart-subtitle">
              Multi-metric comparison across all four models
            </p>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(148,163,184,0.1)" />
                <PolarAngleAxis
                  dataKey="metric"
                  stroke="#64748b"
                  fontSize={11}
                  tick={{ fill: "#94a3b8" }}
                />
                <PolarRadiusAxis
                  domain={[60, 100]}
                  stroke="#64748b"
                  fontSize={10}
                />
                <Radar name="XGBoost" dataKey="XGB" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Random Forest" dataKey="RF" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="SVM" dataKey="SVM" stroke="#f97316" fill="#f97316" fillOpacity={0.05} strokeWidth={1} />
                <Radar name="Logistic Reg." dataKey="LR" stroke="#64748b" fill="#64748b" fillOpacity={0.03} strokeWidth={1} strokeDasharray="4 4" />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Road Segment Risk Prediction */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <Target size={20} style={{ color: "var(--accent-indigo-light)" }} />
            <h3 className="chart-title" style={{ marginBottom: 0 }}>
              Per-Segment Risk Prediction (SHAP Breakdown)
            </h3>
          </div>
          <p className="chart-subtitle">
            Select a road segment to view the XGBoost model&apos;s risk prediction
            and SHAP feature contributions
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {roadSegments.map((seg) => (
              <button
                key={seg.id}
                className={`map-filter-btn ${selectedSegment.id === seg.id ? "active" : ""}`}
                onClick={() => setSelectedSegment(seg)}
                style={{ fontSize: 12 }}
              >
                {seg.name.length > 30 ? seg.name.slice(0, 30) + "…" : seg.name}
              </button>
            ))}
          </div>

          <div className="ml-segment-grid">
            {/* Segment info */}
            <div
              style={{
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-md)",
                padding: 20,
                border: "1px solid var(--border-secondary)",
              }}
            >
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "var(--text-primary)",
                }}
              >
                {selectedSegment.name}
              </h4>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  padding: 16,
                  background:
                    selectedSegment.mlRiskScore >= 80
                      ? "var(--critical-bg)"
                      : selectedSegment.mlRiskScore >= 60
                      ? "var(--high-bg)"
                      : "var(--moderate-bg)",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${selectedSegment.mlRiskScore >= 80 ? "rgba(239,68,68,0.3)" : selectedSegment.mlRiskScore >= 60 ? "rgba(249,115,22,0.3)" : "rgba(234,179,8,0.3)"}`,
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color:
                      selectedSegment.mlRiskScore >= 80
                        ? "var(--critical)"
                        : selectedSegment.mlRiskScore >= 60
                        ? "var(--high)"
                        : "var(--moderate)",
                  }}
                >
                  {selectedSegment.mlRiskScore}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  ML Risk Score
                </div>
              </div>

              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                <div className="metric-row">
                  <span className="metric-label">Highway</span>
                  <span className="metric-value" style={{ fontSize: 13 }}>
                    {selectedSegment.highway}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Length</span>
                  <span className="metric-value" style={{ fontSize: 13 }}>
                    {selectedSegment.length} km
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">AADT</span>
                  <span className="metric-value" style={{ fontSize: 13 }}>
                    {selectedSegment.avgDailyTraffic.toLocaleString()}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Speed Limit</span>
                  <span className="metric-value" style={{ fontSize: 13 }}>
                    {selectedSegment.speedLimit} km/h
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Lanes</span>
                  <span className="metric-value" style={{ fontSize: 13 }}>
                    {selectedSegment.laneCount}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Lighting</span>
                  <span
                    className="metric-value"
                    style={{
                      fontSize: 13,
                      color:
                        selectedSegment.lighting === "poor"
                          ? "var(--critical)"
                          : selectedSegment.lighting === "moderate"
                          ? "var(--moderate)"
                          : "var(--low)",
                    }}
                  >
                    {selectedSegment.lighting}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Predicted Accidents/yr</span>
                  <span
                    className="metric-value"
                    style={{ fontSize: 13, color: "var(--critical)" }}
                  >
                    {selectedSegment.predictedAccidents}
                  </span>
                </div>
              </div>
            </div>

            {/* SHAP values */}
            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "var(--text-primary)",
                }}
              >
                SHAP Feature Contributions
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                How each feature pushes the risk score higher (positive SHAP
                value = increases risk)
              </p>
              {selectedSegment.shapValues.map((sv, i) => (
                <motion.div
                  key={sv.feature}
                  className="feature-bar-group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="feature-bar-header">
                    <span className="feature-bar-name">{sv.feature}</span>
                    <span className="feature-bar-value" style={{ color: `hsl(${Math.max(0, 120 - sv.value * 300)}, 80%, 55%)` }}>
                      +{sv.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="feature-bar" style={{ height: 10 }}>
                    <motion.div
                      className="feature-bar-fill"
                      style={{
                        background: `linear-gradient(90deg, hsl(${Math.max(0, 120 - sv.value * 200)}, 80%, 45%) 0%, hsl(${Math.max(0, 120 - sv.value * 300)}, 80%, 55%) 100%)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(sv.value / 0.55) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                    />
                  </div>
                </motion.div>
              ))}

              <div
                style={{
                  marginTop: 24,
                  padding: "14px 16px",
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "var(--accent-indigo-light)" }}>
                  SHAP Interpretation:
                </strong>{" "}
                For <em>{selectedSegment.name}</em>, the primary risk drivers
                are{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {selectedSegment.shapValues[0].feature}
                </strong>{" "}
                (SHAP +{selectedSegment.shapValues[0].value.toFixed(2)}) and{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {selectedSegment.shapValues[1].feature}
                </strong>{" "}
                (SHAP +{selectedSegment.shapValues[1].value.toFixed(2)}). These
                features push the predicted risk score significantly above the
                baseline, suggesting that infrastructure improvements in these
                areas would have the largest impact on reducing accidents.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
