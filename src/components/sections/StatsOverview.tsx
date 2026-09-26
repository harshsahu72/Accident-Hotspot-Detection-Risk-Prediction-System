"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Skull,
  TrendingDown,
  MapPin,
  Clock,
  Bike,
  Target,
  Brain,
} from "lucide-react";
import { keyStats } from "@/data/accidents";

const stats = [
  {
    icon: AlertTriangle,
    label: "Total Accidents (2023)",
    value: keyStats.totalAccidents2023.toLocaleString(),
    color: "var(--critical)",
    bg: "var(--critical-bg)",
    delta: "+5.4% vs 2022",
    deltaType: "negative",
  },
  {
    icon: Skull,
    label: "Total Deaths (2023)",
    value: keyStats.totalDeaths2023.toLocaleString(),
    color: "var(--high)",
    bg: "var(--high-bg)",
    delta: "+6.3% vs 2022",
    deltaType: "negative",
  },
  {
    icon: TrendingDown,
    label: "Deaths After Intervention (2024)",
    value: "377",
    color: "var(--low)",
    bg: "var(--low-bg)",
    delta: "-6.5% reduction",
    deltaType: "positive",
  },
  {
    icon: MapPin,
    label: "Official Black Spots",
    value: keyStats.officialBlackSpots.toString(),
    color: "var(--accent-violet)",
    bg: "rgba(139, 92, 246, 0.12)",
    delta: "Identified 2024–25",
    deltaType: "neutral",
  },
  {
    icon: Target,
    label: "ML-Predicted Risk Zones",
    value: keyStats.mlPredictedSpots.toString(),
    color: "var(--accent-cyan)",
    bg: "rgba(6, 182, 212, 0.12)",
    delta: "Not yet official",
    deltaType: "neutral",
  },
  {
    icon: Clock,
    label: "Peak Fatality Hours",
    value: "6–9 PM",
    color: "var(--accent-amber)",
    bg: "rgba(245, 158, 11, 0.12)",
    delta: `${keyStats.peakHourFatalityShare}% of all fatalities`,
    deltaType: "negative",
  },
  {
    icon: Bike,
    label: "Two-Wheeler Victims",
    value: `${keyStats.twoWheelerVictimShare}%`,
    color: "var(--accent-rose)",
    bg: "rgba(244, 63, 94, 0.12)",
    delta: "Largest victim group",
    deltaType: "negative",
  },
  {
    icon: Brain,
    label: "XGBoost Model Accuracy",
    value: `${keyStats.modelAccuracy}%`,
    color: "var(--accent-indigo-light)",
    bg: "rgba(99, 102, 241, 0.12)",
    delta: "AUC-ROC: 0.908",
    deltaType: "positive",
  },
];

export default function StatsOverview() {
  return (
    <div className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <AlertTriangle size={14} />
            Key Statistics
          </div>
          <h2 className="section-title">Ludhiana Road Safety at a Glance</h2>
          <p className="section-subtitle">
            Data sourced from NCRB 2023, Punjab Police Traffic Wing, MoRTH black-spot
            reports, and our ML prediction pipeline
          </p>
        </div>

        <div className="stat-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                className="stat-card-icon"
                style={{ background: stat.bg, color: stat.color }}
              >
                <stat.icon size={22} />
              </div>
              <div className="stat-card-label">{stat.label}</div>
              <div className="stat-card-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div
                className={`stat-card-delta ${stat.deltaType === "positive" ? "positive" : stat.deltaType === "negative" ? "negative" : ""}`}
              >
                {stat.delta}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
