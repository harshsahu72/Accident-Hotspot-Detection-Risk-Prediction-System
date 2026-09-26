"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 600,
        background: "var(--bg-tertiary)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div className="loading-spinner" />
      <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
        Loading interactive map…
      </span>
    </div>
  ),
});

export default function MapSection() {
  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            🗺️ GIS Hotspot Detection
          </div>
          <h2 className="section-title">Interactive Accident Hotspot Map</h2>
          <p className="section-subtitle">
            Kernel Density Estimation heatmap overlaid with Getis-Ord Gi* validated
            hotspot clusters. Click any marker for detailed analysis.
          </p>
        </div>
        <MapClient />
      </div>
    </div>
  );
}
