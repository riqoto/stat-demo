"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

type Row = {
  Program: string;
  kesinlikle_katilmiyorum?: number;
  katilmiyorum?: number;
  kararsizim?: number;
  katiliyorum?: number;
  kesinlikle_katiliyorum?: number;
  toplam?: number;
};

const colors = {
  primary: {
    900: '#1a365c',
    700: '#334e68',
    600: '#486581',
    500: '#627d98',
  },
  responses: {
    "Kesinlikle Katılmıyorum": "#DC2626",
    "Katılmıyorum": "#F87171",
    "Kararsızım": "#D97706",
    "Katılıyorum": "#059669",
    "Kesinlikle Katılıyorum": "#047857",
  },
};

export function BarChartComponent({ data }: { data: Row[] }) {
  const chartData = data.map((row) => ({
    name: row.Program,
    "Kesinlikle Katılmıyorum": row.kesinlikle_katilmiyorum || 0,
    "Katılmıyorum": row.katilmiyorum || 0,
    "Kararsızım": row.kararsizim || 0,
    "Katılıyorum": row.katiliyorum || 0,
    "Kesinlikle Katılıyorum": row.kesinlikle_katiliyorum || 0,
  }));

  return (
    <div style={{ width: "100%", height: 'clamp(300px, 60vh, 400px)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, color: colors.primary[900], fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>
        Yanıt Dağılımı - Çubuk Grafik
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={window.innerWidth < 640 ? 10 : 12} />
          <YAxis fontSize={window.innerWidth < 640 ? 10 : 12} />
          <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
          {window.innerWidth > 768 && <Legend />}
          <Bar dataKey="Kesinlikle Katılmıyorum" fill={colors.responses["Kesinlikle Katılmıyorum"]} />
          <Bar dataKey="Katılmıyorum" fill={colors.responses["Katılmıyorum"]} />
          <Bar dataKey="Kararsızım" fill={colors.responses["Kararsızım"]} />
          <Bar dataKey="Katılıyorum" fill={colors.responses["Katılıyorum"]} />
          <Bar dataKey="Kesinlikle Katılıyorum" fill={colors.responses["Kesinlikle Katılıyorum"]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartComponent({ data }: { data: Row[] }) {
  const chartData = data.map((row) => ({
    name: row.Program,
    "Kesinlikle Katılmıyorum": row.kesinlikle_katilmiyorum || 0,
    "Katılmıyorum": row.katilmiyorum || 0,
    "Kararsızım": row.kararsizim || 0,
    "Katılıyorum": row.katiliyorum || 0,
    "Kesinlikle Katılıyorum": row.kesinlikle_katiliyorum || 0,
  }));

  return (
    <div style={{ width: "100%", height: 'clamp(300px, 60vh, 400px)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, color: colors.primary[900], fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>
        Yanıt Trendleri - Çizgi Grafik
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={window.innerWidth < 640 ? 10 : 12} />
          <YAxis fontSize={window.innerWidth < 640 ? 10 : 12} />
          <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
          {window.innerWidth > 768 && <Legend />}
          <Line type="monotone" dataKey="Kesinlikle Katılmıyorum" stroke={colors.responses["Kesinlikle Katılmıyorum"]} strokeWidth={2} dot={window.innerWidth > 768} />
          <Line type="monotone" dataKey="Katılmıyorum" stroke={colors.responses["Katılmıyorum"]} strokeWidth={2} dot={window.innerWidth > 768} />
          <Line type="monotone" dataKey="Kararsızım" stroke={colors.responses["Kararsızım"]} strokeWidth={2} dot={window.innerWidth > 768} />
          <Line type="monotone" dataKey="Katılıyorum" stroke={colors.responses["Katılıyorum"]} strokeWidth={2} dot={window.innerWidth > 768} />
          <Line type="monotone" dataKey="Kesinlikle Katılıyorum" stroke={colors.responses["Kesinlikle Katılıyorum"]} strokeWidth={2} dot={window.innerWidth > 768} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartComponent({ data }: { data: Row[] }) {
  // Aggregate data across all programs
  const aggregated = {
    "Kesinlikle Katılmıyorum": 0,
    "Katılmıyorum": 0,
    "Kararsızım": 0,
    "Katılıyorum": 0,
    "Kesinlikle Katılıyorum": 0,
  };

  data.forEach((row) => {
    aggregated["Kesinlikle Katılmıyorum"] += row.kesinlikle_katilmiyorum || 0;
    aggregated["Katılmıyorum"] += row.katilmiyorum || 0;
    aggregated["Kararsızım"] += row.kararsizim || 0;
    aggregated["Katılıyorum"] += row.katiliyorum || 0;
    aggregated["Kesinlikle Katılıyorum"] += row.kesinlikle_katiliyorum || 0;
  });

  const total = Object.values(aggregated).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(aggregated)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: parseFloat(((value / total) * 100).toFixed(1)),
    }));

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const outerRadius = isMobile ? 80 : 120;

  return (
    <div style={{ width: "100%", height: 'clamp(300px, 60vh, 400px)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, color: colors.primary[900], fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>
        Genel Yanıt Dağılımı - Pasta Grafik
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={!isMobile}
            label={isMobile ? undefined : ({ name, value }) => `${name}: ${value}%`}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.responses[entry.name as keyof typeof colors.responses]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedBarChartComponent({ data }: { data: Row[] }) {
  const chartData = data.map((row) => ({
    name: row.Program,
    "Kesinlikle Katılmıyorum": row.kesinlikle_katilmiyorum || 0,
    "Katılmıyorum": row.katilmiyorum || 0,
    "Kararsızım": row.kararsizim || 0,
    "Katılıyorum": row.katiliyorum || 0,
    "Kesinlikle Katılıyorum": row.kesinlikle_katiliyorum || 0,
  }));

  return (
    <div style={{ width: "100%", height: 'clamp(300px, 60vh, 400px)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, color: colors.primary[900], fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>
        Yığılı Yanıt Dağılımı
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={window.innerWidth < 640 ? 10 : 12} />
          <YAxis fontSize={window.innerWidth < 640 ? 10 : 12} />
          <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
          {window.innerWidth > 768 && <Legend />}
          <Bar dataKey="Kesinlikle Katılmıyorum" stackId="a" fill={colors.responses["Kesinlikle Katılmıyorum"]} />
          <Bar dataKey="Katılmıyorum" stackId="a" fill={colors.responses["Katılmıyorum"]} />
          <Bar dataKey="Kararsızım" stackId="a" fill={colors.responses["Kararsızım"]} />
          <Bar dataKey="Katılıyorum" stackId="a" fill={colors.responses["Katılıyorum"]} />
          <Bar dataKey="Kesinlikle Katılıyorum" stackId="a" fill={colors.responses["Kesinlikle Katılıyorum"]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComparisonChartComponent({ data }: { data: Row[] }) {
  // Compare positive vs negative vs neutral responses
  const chartData = data.map((row) => ({
    name: row.Program,
    "Olumlu": (row.katiliyorum || 0) + (row.kesinlikle_katiliyorum || 0),
    "Nötr": row.kararsizim || 0,
    "Olumsuz": (row.kesinlikle_katilmiyorum || 0) + (row.katilmiyorum || 0),
  }));

  return (
    <div style={{ width: "100%", height: 'clamp(300px, 60vh, 400px)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, color: colors.primary[900], fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600 }}>
        Olumlu/Nötr/Olumsuz Karşılaştırması
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={window.innerWidth < 640 ? 10 : 12} />
          <YAxis fontSize={window.innerWidth < 640 ? 10 : 12} />
          <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
          {window.innerWidth > 768 && <Legend />}
          <Bar dataKey="Olumsuz" fill="#DC2626" />
          <Bar dataKey="Nötr" fill="#D97706" />
          <Bar dataKey="Olumlu" fill="#059669" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
