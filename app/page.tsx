"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const colors = {
  primary: {
    900: '#1a365c',
  },
  secondary: {
    300: '#badde6',
  },
};

export default function Home() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main
      style={{
        background: colors.primary[900],
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI'",
        padding: '16px',
      }}
    >
      <div style={{ textAlign: 'center', padding: 'clamp(16px, 5vw, 32px)', maxWidth: '90vw' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(32px, 8vw, 56px)',
            fontWeight: 700,
            marginBottom: '24px',
            lineHeight: 1.2,
          }}
        >
          Kalite Raporları
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            color: colors.secondary[300],
            marginBottom: '48px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Üniversite Kalite Yönetimi Anket Sonuçları
        </p>

        <button
          onClick={() => router.push('/reports')}
          style={{
            backgroundColor: colors.secondary[300],
            color: colors.primary[900],
            border: 'none',
            padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
            borderRadius: '8px',
            fontSize: 'clamp(16px, 3.5vw, 18px)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: isHovering ? '0 8px 16px rgba(0, 0, 0, 0.3)' : 'none',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Raporu Görüntüle
          <ArrowRightIcon width={20} height={20} />
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          main {
            padding: 16px;
          }
        }
      `}</style>
    </main>
  );
}
