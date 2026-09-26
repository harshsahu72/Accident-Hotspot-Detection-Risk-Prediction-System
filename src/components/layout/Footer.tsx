"use client";

import { MapPin, ExternalLink, Mail, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>
            <span style={{ color: "var(--accent-indigo-light)" }}>Acci</span>Map
            Ludhiana
          </h3>
          <p>
            A GIS and Machine Learning based approach to identify and predict
            road accident-prone zones in Ludhiana, Punjab. This is an academic
            research project (BCA) combining spatial statistics with predictive
            analytics for proactive road safety.
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            <MapPin size={14} />
            Ludhiana, Punjab, India
          </div>
        </div>

        <div className="footer-section">
          <h4>Data Sources</h4>
          <ul>
            <li><a href="#stats" onClick={(e) => { e.preventDefault(); document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" }); }}>NCRB ADSI 2023</a></li>
            <li><a href="#analytics" onClick={(e) => { e.preventDefault(); document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" }); }}>Punjab Police Traffic Report</a></li>
            <li><a href="#hotspots" onClick={(e) => { e.preventDefault(); document.getElementById("hotspots")?.scrollIntoView({ behavior: "smooth" }); }}>MoRTH Black Spot Registry</a></li>
            <li><a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>IRC:131-2022 Guidelines</a></li>
            <li><a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>iRAD / e-DAR System</a></li>
            <li><a href="#map" onClick={(e) => { e.preventDefault(); document.getElementById("map")?.scrollIntoView({ behavior: "smooth" }); }}>OpenStreetMap Network</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Methodology</h4>
          <ul>
            <li><a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>Kernel Density Estimation</a></li>
            <li><a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>Getis-Ord Gi* Statistic</a></li>
            <li><a href="#predictions" onClick={(e) => { e.preventDefault(); document.getElementById("predictions")?.scrollIntoView({ behavior: "smooth" }); }}>XGBoost Classifier</a></li>
            <li><a href="#predictions" onClick={(e) => { e.preventDefault(); document.getElementById("predictions")?.scrollIntoView({ behavior: "smooth" }); }}>SHAP Explainability</a></li>
            <li><a href="#map" onClick={(e) => { e.preventDefault(); document.getElementById("map")?.scrollIntoView({ behavior: "smooth" }); }}>GeoPandas + Leaflet.js</a></li>
            <li><a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>Literature Review</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} AcciMap — Accident Hotspot Prediction
          System. Academic Research Project.
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)" }}
            aria-label="View Source Code on GitHub"
          >
            <Code2 size={18} />
          </a>
          <a
            href="mailto:contact@accimap.local"
            style={{ color: "var(--text-muted)" }}
            aria-label="Contact Research Team via Email"
          >
            <Mail size={18} />
          </a>
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ color: "var(--text-muted)" }}
            aria-label="Back to Top"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
