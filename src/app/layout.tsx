import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AcciMap Ludhiana — Accident Hotspot Prediction System",
  description:
    "A GIS and Machine Learning based system to identify and predict road accident-prone zones in Ludhiana, Punjab. Built using Kernel Density Estimation, Getis-Ord Gi*, and XGBoost for proactive road safety.",
  keywords: [
    "accident hotspot",
    "Ludhiana",
    "Punjab",
    "road safety",
    "GIS",
    "machine learning",
    "KDE",
    "black spots",
    "NH-44",
    "NH-95",
    "traffic accidents",
  ],
  authors: [{ name: "AcciMap Research Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
