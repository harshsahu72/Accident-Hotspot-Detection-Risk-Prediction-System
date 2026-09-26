"use client";

import { useState, useEffect } from "react";
import {
  Navbar,
  Footer,
  Hero,
  StatsOverview,
  MapSection,
  AnalyticsSection,
  HotspotTable,
  MLSection,
  MethodologySection,
} from "@/components";

const sectionIds = [
  "home",
  "stats",
  "map",
  "analytics",
  "hotspots",
  "predictions",
  "methodology",
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id === "stats" ? "home" : id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-container">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="main-content">
        <section id="home">
          <Hero onNavigate={setActiveSection} />
        </section>
        <section id="stats">
          <StatsOverview />
        </section>
        <section id="map">
          <MapSection />
        </section>
        <section id="analytics">
          <AnalyticsSection />
        </section>
        <section id="hotspots">
          <HotspotTable />
        </section>
        <section id="predictions">
          <MLSection />
        </section>
        <section id="methodology">
          <MethodologySection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
