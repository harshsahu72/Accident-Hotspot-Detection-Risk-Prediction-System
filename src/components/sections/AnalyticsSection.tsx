"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  yearlyTrends,
  hourlyDistribution,
  monthlyDistribution,
  vehicleTypeStats,
  accidentCauses,
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
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState<"trends" | "hourly" | "monthly" | "vehicles" | "causes">("trends");

  const tabs = [
    { id: "trends" as const, label: "📈 Yearly Trends" },
    { id: "hourly" as const, label: "🕐 Hourly Pattern" },
    { id: "monthly" as const, label: "📅 Monthly Pattern" },
    { id: "vehicles" as const, label: "🚗 Vehicle Types" },
    { id: "causes" as const, label: "⚠️ Accident Causes" },
  ];

  return (
    <div className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">📊 Data Analytics</div>
          <h2 className="section-title">Accident Pattern Analysis</h2>
          <p className="section-subtitle">
            Temporal, spatial, and categorical breakdown of Ludhiana accident
            data (2018–2024)
          </p>
        </div>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "trends" && (
            <div className="chart-container">
              <h3 className="chart-title">Yearly Accident & Fatality Trends</h3>
              <p className="chart-subtitle">
                Note the 2020 dip (COVID lockdown) and the 2024 reduction after
                black-spot intervention
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={yearlyTrends}>
                  <defs>
                    <linearGradient id="gradAccidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDeaths" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradInjuries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="totalAccidents"
                    name="Total Accidents"
                    stroke="#6366f1"
                    fill="url(#gradAccidents)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="deaths"
                    name="Deaths"
                    stroke="#ef4444"
                    fill="url(#gradDeaths)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="injuries"
                    name="Injuries"
                    stroke="#f97316"
                    fill="url(#gradInjuries)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "hourly" && (
            <div className="chart-container">
              <h3 className="chart-title">Hourly Distribution of Accidents</h3>
              <p className="chart-subtitle">
                The 6–9 PM window accounts for ~26% of all fatalities (Punjab
                Police, 2023)
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis
                    dataKey="hour"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(h) => `${h}:00`}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accidents" name="Accidents" radius={[4, 4, 0, 0]}>
                    {hourlyDistribution.map((entry) => (
                      <Cell
                        key={entry.hour}
                        fill={
                          entry.hour >= 18 && entry.hour <= 20
                            ? "#ef4444"
                            : entry.hour >= 16 && entry.hour <= 21
                            ? "#f97316"
                            : "#6366f1"
                        }
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="fatalities"
                    name="Fatalities"
                    fill="#ef444466"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "var(--critical-bg)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                ⚠️ <strong style={{ color: "var(--critical)" }}>Peak danger window: 6:00 PM – 9:00 PM</strong>
                {" "}— Poor visibility, rush hour congestion, and driver fatigue combine to make evening hours the deadliest.
              </div>
            </div>
          )}

          {activeTab === "monthly" && (
            <div className="chart-container">
              <h3 className="chart-title">Monthly Accident Distribution</h3>
              <p className="chart-subtitle">
                Winter months (Nov–Jan) show elevated fatalities due to fog on
                highways
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="accidents"
                    name="Accidents"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 5 }}
                    activeDot={{ r: 7, fill: "#818cf8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fatalities"
                    name="Fatalities"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ fill: "#ef4444", r: 5 }}
                    activeDot={{ r: 7, fill: "#f87171" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="analytics-grid-2col">
              <div className="chart-container">
                <h3 className="chart-title">Victim Distribution by Vehicle</h3>
                <p className="chart-subtitle">
                  Two-wheelers account for 38.5% of all victims
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={vehicleTypeStats}
                      dataKey="percentage"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={3}
                      label={(entry: { name?: string; percent?: number; payload?: { type?: string; percentage?: number } }) =>
                        `${entry.payload?.type ?? entry.name}: ${entry.payload?.percentage ?? ((entry.percent ?? 0) * 100).toFixed(1)}%`
                      }
                      labelLine={{ stroke: "#64748b" }}
                    >
                      {vehicleTypeStats.map((entry) => (
                        <Cell key={entry.type} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-container">
                <h3 className="chart-title">Fatality Rate by Vehicle Type</h3>
                <p className="chart-subtitle">
                  Trucks and pedestrians have the highest per-accident fatality
                  rates
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={vehicleTypeStats} cx="50%" cy="50%" outerRadius={110}>
                    <PolarGrid stroke="rgba(148,163,184,0.1)" />
                    <PolarAngleAxis
                      dataKey="type"
                      stroke="#64748b"
                      fontSize={11}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <PolarRadiusAxis
                      stroke="#64748b"
                      fontSize={10}
                      domain={[0, 100]}
                    />
                    <Radar
                      name="Fatality Rate %"
                      dataKey="fatalityRate"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "causes" && (
            <div className="chart-container">
              <h3 className="chart-title">Primary Causes of Accidents</h3>
              <p className="chart-subtitle">
                Overspeeding alone accounts for nearly a third of all accidents
              </p>
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                {accidentCauses.map((cause, i) => (
                  <motion.div
                    key={cause.cause}
                    className="feature-bar-group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="feature-bar-header">
                      <span className="feature-bar-name">{cause.cause}</span>
                      <span
                        className="feature-bar-value"
                        style={{ color: cause.color }}
                      >
                        {cause.percentage}%
                      </span>
                    </div>
                    <div className="feature-bar">
                      <motion.div
                        className="feature-bar-fill"
                        style={{ background: cause.color }}
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(cause.percentage / 35) * 100}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.06 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
