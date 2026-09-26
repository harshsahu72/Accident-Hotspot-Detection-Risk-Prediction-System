"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, AlertTriangle, Shield } from "lucide-react";
import { keyStats } from "@/data/accidents";

export interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount1(Math.round(eased * keyStats.totalAccidents2023));
      setCount2(Math.round(eased * keyStats.totalDeaths2023));
      setCount3(Math.round(eased * keyStats.fatalityRate * 10) / 10);

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    onNavigate(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AlertTriangle size={14} />
          NCRB 2023 — Ludhiana Ranked 3rd Deadliest City in India
        </motion.div>

        <h1 className="hero-title">
          <span className="danger-text">Accident Hotspot</span>
          <br />
          <span className="gradient-text">Prediction System</span>
        </h1>

        <p className="hero-subtitle">
          A GIS and Machine Learning based approach to identify and predict
          road accident-prone zones in <strong>Ludhiana, Punjab</strong> — combining
          Kernel Density Estimation, Getis-Ord Gi* spatial statistics, and
          XGBoost risk modeling on an interactive dashboard.
        </p>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: "var(--critical)" }}>
              {count1}
            </div>
            <div className="hero-stat-label">Accidents (2023)</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: "var(--high)" }}>
              {count2}
            </div>
            <div className="hero-stat-label">Deaths (2023)</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: "var(--accent-rose)" }}>
              {count3}%
            </div>
            <div className="hero-stat-label">Fatality Rate</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: "var(--accent-indigo-light)" }}>
              #{keyStats.ncrb2023Rank}
            </div>
            <div className="hero-stat-label">NCRB Rank</div>
          </div>
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button className="btn btn-primary" onClick={() => scrollTo("map")}>
            <MapPin size={18} />
            Explore Hotspot Map
            <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => scrollTo("predictions")}>
            <Shield size={18} />
            View ML Predictions
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
