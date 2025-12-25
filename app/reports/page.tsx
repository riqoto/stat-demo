"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import SectionSidebar from "../../components/SectionSidebar";
import InteractiveTable from "../../components/InteractiveTable";
import { BarChartComponent, LineChartComponent, PieChartComponent, StackedBarChartComponent, ComparisonChartComponent } from "../../components/Charts";
import sectionsData from "../../data/sections.json";

const colors = {
  primary: {
    900: '#1a365c',
    700: '#334e68',
    500: '#627d98',
    50: '#f0f4f8',
  },
  secondary: {
    300: '#badde6',
    100: '#e8f5f8',
  },
};

const RadixButton = ({
  onClick,
  disabled = false,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: "#627d98",
      color: "#ffffff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontSize: "14px",
      fontWeight: "500",
    },
    secondary: {
      backgroundColor: "transparent",
      color: colors.primary[900],
      border: "none",
      padding: "4px 8px",
      borderRadius: "4px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    danger: {
      backgroundColor: "#DC2626",
      color: "#ffffff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontSize: "14px",
      fontWeight: "500",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={variantStyles[variant] as React.CSSProperties}
    >
      {children}
    </button>
  );
};

export default function ReportsPage() {
  const [selectedSection, setSelectedSection] = useState(sectionsData[0]?.id || null);
  const [selectedChartType, setSelectedChartType] = useState<"bar" | "line" | "pie" | "stacked" | "comparison">("bar");
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set([sectionsData[0]?.id || ""]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");
            if (sectionId) {
              setLoadedSections((prev) => new Set([...prev, sectionId]));
            }
          }
        });
      },
      { rootMargin: "200px" }
    );

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const handleSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current[id] = el;
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    }
  }, []);

  const handleSectionClick = (id: string) => {
    setSelectedSection(id);
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI'", flexDirection: 'row' }}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: colors.primary[900],
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
        className="mobile-toggle"
      >
        ☰ Menü
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: 'relative',
          display: sidebarOpen ? 'block' : 'block',
          zIndex: sidebarOpen ? 999 : 'auto',
        }}
        className="sidebar-container"
      >
        <SectionSidebar
          sections={sectionsData}
          selectedId={selectedSection}
          onSelect={(id) => {
            handleSectionClick(id);
            setSidebarOpen(false);
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: colors.primary[50],
        }}
      >
        <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
          <h1 style={{ margin: 0, color: colors.primary[900], fontSize: 'clamp(24px, 6vw, 28px)', marginBottom: 8 }}>
            Kalite Anket Raporu
          </h1>
          <p style={{ margin: 0, color: colors.primary[700], marginBottom: 24, fontSize: 'clamp(13px, 3vw, 14px)' }}>
            Üniversite Kalite Yönetimi Raporu - İnteraktif Gösterim
          </p>

          {sectionsData.map((section) => (
            <div
              key={section.id}
              data-section-id={section.id}
              ref={handleSectionRef(section.id)}
              style={{
                marginBottom: 'clamp(24px, 6vw, 48px)',
                background: "#fff",
                borderRadius: 8,
                padding: 'clamp(16px, 4vw, 24px)',
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minHeight: 400,
              }}
            >
              {loadedSections.has(section.id) ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <h2 style={{ margin: 0, color: colors.primary[900], fontSize: 'clamp(18px, 5vw, 20px)', marginBottom: 8 }}>
                      {section.title}
                    </h2>
                    <p style={{ margin: 0, color: colors.primary[700], fontSize: 'clamp(13px, 3vw, 14px)', lineHeight: 1.6 }}>
                      {section.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 16,
                      marginBottom: 16,
                      padding: 12,
                      background: colors.secondary[100],
                      borderRadius: 6,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: colors.primary[700], fontWeight: 600 }}>
                        Katılımcı Sayısı
                      </span>
                      <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: colors.primary[900] }}>
                        {section.participantCount}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: colors.primary[700], fontWeight: 600 }}>
                        Toplam Anket
                      </span>
                      <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: colors.primary[900] }}>
                        {section.totalSurveys}
                      </div>
                    </div>
                  </div>

                  {/* Charts Tabs - Responsive */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      {(["bar", "line", "pie", "stacked", "comparison"] as const).map((type) => (
                        <RadixButton
                          key={type}
                          variant={selectedChartType === type ? "primary" : "secondary"}
                          onClick={() => setSelectedChartType(type)}
                        >
                          {type === "bar" && "Çubuk"}
                          {type === "line" && "Çizgi"}
                          {type === "pie" && "Pasta"}
                          {type === "stacked" && "Yığılı"}
                          {type === "comparison" && "Karş."}
                        </RadixButton>
                      ))}
                    </div>

                    {/* Chart Display - Responsive */}
                    <div style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: 'clamp(8px, 3vw, 16px)',
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      overflowX: 'auto',
                    }}>
                      {selectedChartType === "bar" && <BarChartComponent data={section.rows} />}
                      {selectedChartType === "line" && <LineChartComponent data={section.rows} />}
                      {selectedChartType === "pie" && <PieChartComponent data={section.rows} />}
                      {selectedChartType === "stacked" && <StackedBarChartComponent data={section.rows} />}
                      {selectedChartType === "comparison" && <ComparisonChartComponent data={section.rows} />}
                    </div>
                  </div>

                  {/* Interactive Table */}
                  <div style={{ marginTop: 32 }}>
                    <h3 style={{ margin: "0 0 16px 0", color: colors.primary[900], fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 600 }}>
                      İnteraktif Tablo
                    </h3>
                    <InteractiveTable
                      data={section.rows}
                      onSelect={() => {}}
                    />
                  </div>
                </>
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 400,
                  color: colors.primary[700],
                  fontSize: 14,
                }}>
                  <div style={{
                    animation: "pulse 1.5s infinite",
                  }}>
                    Yükleniyor...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
          }

          .sidebar-container {
            position: fixed;
            top: 0;
            left: ${sidebarOpen ? '0' : '-280px'};
            height: 100vh;
            transition: left 0.3s ease;
            z-index: 998;
          }

          [style*="flex: 1"] {
            margin-left: 0 !important;
          }
        }

        @media (max-width: 640px) {
          button {
            padding: clamp(6px, 2vw, 8px) clamp(10px, 3vw, 16px) !important;
            font-size: clamp(12px, 2.5vw, 14px) !important;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
