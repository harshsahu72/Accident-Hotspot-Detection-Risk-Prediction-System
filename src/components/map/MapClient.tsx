"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hotspotZones, heatmapPoints, accidentRecords } from "@/data/accidents";
import type { HotspotZone } from "@/types";

type FilterType = "all" | "critical" | "high" | "moderate" | "predicted";

const riskColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
  low: "#22c55e",
};

const riskClasses: Record<string, string> = {
  critical: "custom-marker-critical",
  high: "custom-marker-high",
  moderate: "custom-marker-moderate",
  low: "custom-marker-low",
};

function createHotspotIcon(riskLevel: string, size: number = 28) {
  return L.divIcon({
    className: riskClasses[riskLevel] || "custom-marker-low",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createPopupContent(zone: HotspotZone) {
  const riskColor = riskColors[zone.riskLevel] || "#22c55e";
  return `
    <div style="min-width: 240px;">
      <div class="popup-hotspot-name">${zone.name}</div>
      <div class="popup-road">${zone.roadSegment} ${zone.isOfficialBlackSpot ? '• <span style="color: var(--critical);">Official Black Spot</span>' : '• <span style="color: var(--accent-cyan);">ML Predicted</span>'}</div>
      <div style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:600;background:${riskColor}22;color:${riskColor};border:1px solid ${riskColor}44;margin-bottom:10px;">
        ● ${zone.riskLevel.toUpperCase()} RISK
      </div>
      <div class="popup-stats">
        <div class="popup-stat">
          <div class="popup-stat-val" style="color:var(--critical);">${zone.accidentCount}</div>
          <div class="popup-stat-label">Accidents</div>
        </div>
        <div class="popup-stat">
          <div class="popup-stat-val" style="color:var(--high);">${zone.fatalityCount}</div>
          <div class="popup-stat-label">Fatalities</div>
        </div>
        <div class="popup-stat">
          <div class="popup-stat-val" style="color:var(--accent-indigo-light);">${zone.mlRiskScore}</div>
          <div class="popup-stat-label">ML Score</div>
        </div>
        <div class="popup-stat">
          <div class="popup-stat-val" style="color:var(--accent-cyan);">${zone.kdeScore.toFixed(2)}</div>
          <div class="popup-stat-label">KDE Score</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Gi* z-score: <strong style="color:var(--text-primary);">${zone.giStarZ.toFixed(2)}</strong> (p = ${zone.giStarP})</div>
      <div class="popup-factors">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Risk Factors:</div>
        ${zone.topFactors.map((f) => `<span class="popup-factor-tag">${f}</span>`).join("")}
      </div>
    </div>
  `;
}

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const heatLayer = useRef<L.LayerGroup | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const container = mapRef.current as HTMLElement & { _leaflet_id?: number | null };
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    const map = L.map(container, {
      center: [30.9010, 75.8573],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    heatLayer.current = L.layerGroup().addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markersLayer.current = null;
      heatLayer.current = null;
    };
  }, []);

  // Update heat circles
  const updateHeatmap = useCallback(() => {
    if (!heatLayer.current || !mapInstance.current) return;
    heatLayer.current.clearLayers();

    if (!showHeatmap) return;

    heatmapPoints.forEach(([lat, lng, intensity]) => {
      const radius = 200 + intensity * 400;
      const opacity = 0.08 + intensity * 0.18;

      let color: string;
      if (intensity > 0.8) color = "#ef4444";
      else if (intensity > 0.6) color = "#f97316";
      else if (intensity > 0.4) color = "#eab308";
      else color = "#22c55e";

      L.circle([lat, lng], {
        radius,
        color: "transparent",
        fillColor: color,
        fillOpacity: opacity,
        interactive: false,
      }).addTo(heatLayer.current!);
    });
  }, [showHeatmap]);

  // Update markers
  const updateMarkers = useCallback(() => {
    if (!markersLayer.current || !mapInstance.current) return;
    markersLayer.current.clearLayers();

    if (showMarkers) {
      const filteredZones = hotspotZones.filter((z) => {
        if (filter === "all") return true;
        if (filter === "predicted") return !z.isOfficialBlackSpot;
        return z.riskLevel === filter;
      });

      filteredZones.forEach((zone) => {
        const size =
          zone.riskLevel === "critical"
            ? 32
            : zone.riskLevel === "high"
            ? 26
            : 20;
        const marker = L.marker([zone.lat, zone.lng], {
          icon: createHotspotIcon(zone.riskLevel, size),
        });

        marker.bindPopup(createPopupContent(zone), {
          maxWidth: 320,
          className: "custom-popup",
        });

        marker.addTo(markersLayer.current!);
      });
    }

    // Individual accident incident dots
    if (showIncidents) {
      const filteredRecords = accidentRecords.filter((record) => {
        if (filter === "all") return true;
        if (filter === "critical") return record.severity === "fatal";
        if (filter === "high") return record.severity === "fatal" || record.severity === "serious";
        if (filter === "moderate") return record.severity === "serious" || record.severity === "minor";
        return true;
      });

      filteredRecords.forEach((record) => {
        const color =
          record.severity === "fatal"
            ? "#ef4444"
            : record.severity === "serious"
            ? "#f97316"
            : "#eab308";

        L.circleMarker([record.lat, record.lng], {
          radius: 4,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.65,
          interactive: true,
        })
          .bindPopup(
            `<div style="min-width:180px;">
              <div style="font-weight:700;margin-bottom:4px;font-size:13px;">${record.description}</div>
              <div style="font-size:11px;color:var(--text-muted);">${record.date} at ${record.time}</div>
              <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
                <span style="padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:${color}22;color:${color};border:1px solid ${color}44;">${record.severity.toUpperCase()}</span>
                <span style="padding:2px 8px;border-radius:9999px;font-size:10px;background:rgba(99,102,241,0.1);color:var(--accent-indigo-light);border:1px solid var(--border-primary);">${record.vehicleType}</span>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Cause: <strong style="color:var(--text-primary);">${record.cause}</strong></div>
            </div>`,
            { maxWidth: 280 }
          )
          .addTo(markersLayer.current!);
      });
    }
  }, [filter, showMarkers, showIncidents]);

  useEffect(() => {
    updateHeatmap();
  }, [updateHeatmap]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  const handleResetView = () => {
    if (mapInstance.current) {
      mapInstance.current.setView([30.9010, 75.8573], 12);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="map-container" ref={mapRef} />

      {/* Filter controls */}
      <div className="map-overlay">
        <button
          className={`map-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Zones
        </button>
        <button
          className={`map-filter-btn ${filter === "critical" ? "active" : ""}`}
          onClick={() => setFilter("critical")}
        >
          🔴 Critical
        </button>
        <button
          className={`map-filter-btn ${filter === "high" ? "active" : ""}`}
          onClick={() => setFilter("high")}
        >
          🟠 High Risk
        </button>
        <button
          className={`map-filter-btn ${filter === "moderate" ? "active" : ""}`}
          onClick={() => setFilter("moderate")}
        >
          🟡 Moderate
        </button>
        <button
          className={`map-filter-btn ${filter === "predicted" ? "active" : ""}`}
          onClick={() => setFilter("predicted")}
        >
          🤖 ML Predicted
        </button>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            className={`map-filter-btn ${showHeatmap ? "active" : ""}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? "🌡️ Hide Heatmap" : "🌡️ Show Heatmap"}
          </button>
          <button
            className={`map-filter-btn ${showMarkers ? "active" : ""}`}
            onClick={() => setShowMarkers(!showMarkers)}
          >
            {showMarkers ? "📍 Hide Hotspots (15)" : "📍 Show Hotspots (15)"}
          </button>
          <button
            className={`map-filter-btn ${showIncidents ? "active" : ""}`}
            onClick={() => setShowIncidents(!showIncidents)}
          >
            {showIncidents ? "💥 Hide Incidents (35)" : "💥 Show Incidents (35)"}
          </button>
          <button
            className="map-filter-btn"
            onClick={handleResetView}
            style={{ color: "var(--accent-indigo-light)" }}
          >
            🎯 Recenter Map
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend-title">Risk Level</div>
        <div className="map-legend-item">
          <div className="map-legend-dot" style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.5)" }} />
          Critical (Gi* z &gt; 3.5)
        </div>
        <div className="map-legend-item">
          <div className="map-legend-dot" style={{ background: "#f97316" }} />
          High Risk (z 2.5–3.5)
        </div>
        <div className="map-legend-item">
          <div className="map-legend-dot" style={{ background: "#eab308" }} />
          Moderate (z 1.5–2.5)
        </div>
        <div className="map-legend-item">
          <div className="map-legend-dot" style={{ background: "#22c55e" }} />
          Low (z &lt; 1.5)
        </div>
        <div style={{ borderTop: "1px solid var(--border-secondary)", marginTop: 10, paddingTop: 10 }}>
          <div className="map-legend-item">
            <div className="map-legend-dot" style={{ background: "var(--accent-indigo)", border: "2px dashed var(--accent-cyan)" }} />
            ML Predicted Zone
          </div>
          <div className="map-legend-item">
            <div className="map-legend-dot" style={{ background: "#ef4444", width: 8, height: 8 }} />
            Recorded Incident Dot
          </div>
        </div>
      </div>
    </div>
  );
}
