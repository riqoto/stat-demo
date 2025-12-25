"use client";
import React, { memo } from "react";

const colors = {
  primary: {
    900: '#1a365c',
    700: '#334e68',
    500: '#627d98',
  },
  secondary: {
    300: '#badde6',
  },
};

const SectionButton = memo(({
  section,
  isSelected,
  onSelect,
}: {
  section: { id: string; title: string };
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <button
    onClick={() => onSelect(section.id)}
    style={{
      width: '100%',
      padding: 12,
      marginBottom: 4,
      textAlign: 'left',
      background: isSelected ? colors.secondary[300] : 'transparent',
      color: isSelected ? colors.primary[900] : '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: isSelected ? 600 : 400,
      transition: 'all 0.2s',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      contain: 'layout style paint',
      willChange: 'background-color, color',
    }}
    title={section.title}
  >
    {section.title}
  </button>
));

SectionButton.displayName = "SectionButton";

export default function SectionSidebar({
  sections,
  selectedId,
  onSelect,
}: {
  sections: Array<{ id: string; title: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div
        style={{
          width: 280,
          background: colors.primary[900],
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
        }}
        className="sidebar-main"
      >
        <div style={{ padding: 16, borderBottom: `1px solid ${colors.primary[700]}`, flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>Başlıklar</h3>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px',
            contain: 'strict',
          }}
          className="custom-scrollbar"
        >
          {sections.map((section) => (
            <SectionButton
              key={section.id}
              section={section}
              isSelected={selectedId === section.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.primary[900]};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.secondary[300]};
          border-radius: 4px;
          border: 2px solid ${colors.primary[900]};
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary[700]};
        }

        .custom-scrollbar {
          scrollbar-color: ${colors.secondary[300]} ${colors.primary[900]};
          scrollbar-width: thin;
        }

        @media (max-width: 768px) {
          .sidebar-main {
            width: 280px;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 998;
            height: 100vh;
          }
        }

        @media (max-width: 640px) {
          .sidebar-main {
            width: 240px;
          }

          .sidebar-main h3 {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
