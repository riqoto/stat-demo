"use client";
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";

type Row = {
  program: string;
  kesinlikle: number;
  katiliyorum: number;
  kararsiz: number;
  katilmiyorum: number;
  kesinlikle_katilmiyorum: number;
  fikrim_yok: number;
};

export default function Chart({ row }: { row: Row | null }) {
  if (!row) {
    return <div>Bir satır seçin; seçilen satırın görselleştirmesi burada gözükecek.</div>;
  }

  const categories = [
    { key: "kesinlikle", label: "Kesinlikle" },
    { key: "katiliyorum", label: "Katılıyorum" },
    { key: "kararsiz", label: "Kararsızım" },
    { key: "katilmiyorum", label: "Katılmıyorum" },
    { key: "kesinlikle_katilmiyorum", label: "Kesinlikle Katılmıyorum" },
    { key: "fikrim_yok", label: "Fikrim yok" },
  ];

  // Prepare values
  const data = categories.map((c) => ({ label: c.label, value: (row as any)[c.key] })) as Array<{
    label: string;
    value: number;
  }>;

  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 20, left: 160 };

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [margin.top, height - margin.bottom],
    padding: 0.2,
  });

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.value)) || 100],
    range: [margin.left, width - margin.right],
    nice: true,
  });

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>{row.program} — Kategori Dağılımı (%)</h3>
      <svg width={width} height={height}>
        {data.map((d) => {
          const y = yScale(d.label) || 0;
          const barHeight = yScale.bandwidth();
          const x = xScale(0);
          const barWidth = xScale(d.value) - xScale(0);
          return (
            <g key={d.label}>
              <text x={margin.left - 12} y={y + barHeight / 2} textAnchor="end" alignmentBaseline="middle" fontSize={12}>
                {d.label}
              </text>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                rx={4}
              />
              <text x={x + barWidth + 8} y={y + barHeight / 2} alignmentBaseline="middle" fontSize={12}>
                {d.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
