"use client";

import { useState, useEffect } from "react";
import {
  Map,
  BarChart3,
  Brain,
  AlertTriangle,
  BookOpen,
  Home,
  Menu,
  X,
} from "lucide-react";

export interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "map", label: "Hotspot Map", icon: Map },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "hotspots", label: "Black Spots", icon: AlertTriangle },
  { id: "predictions", label: "ML Predictions", icon: Brain },
  { id: "methodology", label: "Methodology", icon: BookOpen },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <button
          className="nav-brand"
          onClick={() => handleClick("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="AcciMap Ludhiana Home"
        >
          <div className="nav-logo">A</div>
          <div className="nav-title">
            Acci<span>Map</span>
          </div>
        </button>

        <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => handleClick(item.id)}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
