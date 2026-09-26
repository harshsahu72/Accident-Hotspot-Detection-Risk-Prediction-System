"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Data Collection & Geocoding",
    description:
      "Historical accident records from Punjab Police, NCRB 2023, MoRTH/IRC black-spot reports, and Tandarust Punjab Mission surveys are compiled into a geocoded, segment-level dataset. Each record is mapped to road segments using OpenStreetMap road network data and reverse geocoding.",
    formula: null,
    details: [
      "Sources: NCRB ADSI 2023, Punjab Police Traffic Report, iRAD database",
      "504 accidents + 402 deaths in Ludhiana (2023)",
      "Road segmentation: 500m intervals along NH-44, NH-95, GT Road",
      "Temporal features: hour, day of week, month, season",
    ],
  },
  {
    number: 2,
    title: "Kernel Density Estimation (KDE)",
    description:
      "KDE creates a continuous density surface over the study area from discrete accident point locations. Using a Gaussian kernel with an adaptive bandwidth, the method produces a heatmap that visually identifies where accidents are spatially concentrated, without requiring predefined zone boundaries.",
    formula: "f̂(x) = (1/nh) Σᵢ K((x - xᵢ)/h)",
    details: [
      "Kernel: Gaussian with adaptive bandwidth (Silverman's rule)",
      "Grid resolution: 100m × 100m cells across Ludhiana district",
      "Output: continuous accident density surface (0–1 normalized)",
      "Validated against known NH-44 black spots (Tandarust Punjab 2019)",
    ],
  },
  {
    number: 3,
    title: "Getis-Ord Gi* Spatial Statistic",
    description:
      'The Gi* statistic tests whether observed accident clustering is statistically significant rather than random. A high positive z-score (and low p-value) confirms that a location is a genuine "hot spot" where accidents cluster more intensely than expected by chance alone. This provides rigorous validation beyond visual KDE heatmaps.',
    formula: "Gi* = [Σⱼ wᵢⱼxⱼ − X̄ Σⱼ wᵢⱼ] / S √[(n Σⱼ wᵢⱼ² − (Σⱼ wᵢⱼ)²) / (n-1)]",
    details: [
      "z > 2.58 → 99% confidence hot spot (p < 0.01)",
      "z > 1.96 → 95% confidence hot spot (p < 0.05)",
      "Spatial weight matrix: inverse distance within 1 km radius",
      "12 of 12 official black spots confirmed at p < 0.01",
    ],
  },
  {
    number: 4,
    title: "Machine Learning Risk Prediction (XGBoost)",
    description:
      "An XGBoost classifier is trained on road-segment features to predict forward-looking risk scores. Unlike the backward-looking KDE/Gi* analysis, the ML model can flag segments that share the risk profile of known black spots even before accidents accumulate — addressing the core problem of the 3-year MoRTH identification lag.",
    formula: "ŷ = Σₖ fₖ(x),  fₖ ∈ F  (ensemble of CART trees)",
    details: [
      "Features: traffic volume, lighting, lanes, speed limit, surface, median, curve, fog exposure",
      "Training: 70/15/15 split with SMOTE for class imbalance",
      "Best accuracy: 86.2% (XGBoost) vs 41.5% baseline (Khanum et al.)",
      "Hyperparameter tuning: Bayesian optimization with 5-fold CV",
    ],
  },
  {
    number: 5,
    title: "SHAP Explainability",
    description:
      "SHAP (SHapley Additive exPlanations) provides a game-theoretic approach to explain each individual prediction. For every road segment, SHAP values show exactly which features pushed the risk score up or down, making the model's decisions transparent and actionable for traffic police and city engineers.",
    formula: "φᵢ = Σ_{S⊆N\\{i}} [|S|!(|N|-|S|-1)!/|N|!] · [f(S∪{i}) − f(S)]",
    details: [
      "Per-segment feature attribution: which factors drive each risk score",
      "Global importance ranking: traffic volume > lighting > lanes > speed",
      "Actionable output: 'Install lighting' directly reduces SHAP contribution",
      "Addresses the 'black box' criticism of ML severity-prediction studies",
    ],
  },
  {
    number: 6,
    title: "Interactive React Dashboard",
    description:
      "The final output layer is a web-based interactive dashboard that combines all analytical results into an accessible, visual tool. Traffic officers see a prioritised risk map; engineers see specific infrastructure fixes per segment; citizens see which stretches to avoid, especially during the 6–9 PM danger window.",
    formula: null,
    details: [
      "Built with Next.js (React) + Leaflet.js for GIS visualization",
      "Dark CARTO basemap with KDE heatmap overlay",
      "Filterable by risk level, official/predicted status",
      "SHAP-based plain-language explanations for each hotspot",
    ],
  },
];

export default function MethodologySection() {
  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">📐 Methodology</div>
          <h2 className="section-title">Technical Approach & Pipeline</h2>
          <p className="section-subtitle">
            Six-stage pipeline from raw accident data to interactive
            risk-prediction dashboard
          </p>
        </div>

        {/* Pipeline flow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {["Data", "KDE", "Gi*", "XGBoost", "SHAP", "Dashboard"].map(
            (step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "8px 20px",
                    background:
                      i === 3
                        ? "var(--gradient-primary)"
                        : "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-full)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: i === 3 ? "white" : "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step}
                </motion.div>
                {i < 5 && (
                  <span style={{ color: "var(--text-muted)", fontSize: 16 }}>
                    →
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* Method cards */}
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            className="method-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div className="method-number">{step.number}</div>
            <h3 className="method-title">{step.title}</h3>
            <p className="method-desc">{step.description}</p>

            {step.formula && (
              <div className="method-formula">{step.formula}</div>
            )}

            <ul
              style={{
                marginTop: 16,
                paddingLeft: 20,
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              {step.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Architecture diagram summary */}
        <motion.div
          className="card-glass"
          style={{
            marginTop: 24,
            textAlign: "center",
            padding: 32,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            System Architecture Summary
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            <strong>Input:</strong> Punjab Police + NCRB + MoRTH accident
            records → <strong>Processing:</strong> Python pipeline (pandas,
            GeoPandas, scikit-learn, XGBoost) for KDE hotspot detection, Gi*
            validation, and ML risk scoring → <strong>Output:</strong> Next.js
            React dashboard with Leaflet GIS map, Recharts analytics, and
            SHAP-based explanations → <strong>Validation:</strong> System output
            compared against Ludhiana&apos;s 12 official black spots and Punjab&apos;s 92
            NH-44 black spots.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
