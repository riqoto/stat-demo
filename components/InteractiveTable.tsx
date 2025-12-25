"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CheckIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

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
  secondary: {
    300: '#badde6',
  },
  danger: {
    500: '#EF4444',
  },
  success: {
    500: '#059669',
  },
};

const columnMapping = [
  { key: "Program", header: "Program" },
  { key: "kesinlikle_katilmiyorum", header: "Kesinlikle Katılmıyorum (%)" },
  { key: "katilmiyorum", header: "Katılmıyorum (%)" },
  { key: "kararsizim", header: "Kararsızım (%)" },
  { key: "katiliyorum", header: "Katılıyorum (%)" },
  { key: "kesinlikle_katiliyorum", header: "Kesinlikle Katılıyorum (%)" },
];

// Radix-styled button component
const RadixButton = ({
  onClick,
  disabled,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "8px 12px",
      borderRadius: 6,
      background:
        variant === "primary"
          ? disabled
            ? "#ddd"
            : colors.primary[900]
          : "transparent",
      color: variant === "primary" ? "#fff" : colors.primary[900],
      border:
        variant === "secondary"
          ? `1px solid ${colors.primary[600]}`
          : "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 500,
      fontSize: 14,
      transition: "all 0.2s",
    }}
  >
    {children}
  </button>
);

export default function InteractiveTable({
  data,
  onSelect,
}: {
  data: Row[];
  onSelect: (row: Row | null) => void;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => columnMapping.map(({ key, header }) => ({
      accessorKey: key,
      header,
    })),
    []
  );

  const filtered = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) => {
      if (r.Program.toLowerCase().includes(q)) return true;
      return Object.values(r).some((v) =>
        String(v).toLowerCase().includes(q)
      );
    });
  }, [data, globalFilter]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle row click - show details table
  const handleRowClick = (row: Row) => {
    setSelectedRow(selectedRow?.Program === row.Program ? null : row);
    onSelect(selectedRow?.Program === row.Program ? null : row);
  };

  return (
    <Tooltip.Provider>
      <div>
        {/* Search and Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: 'clamp(200px, 100%, 400px)',
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 6,
              border: `2px solid ${colors.primary[600]}`,
              background: "#fff",
            }}
          >
            <MagnifyingGlassIcon color={colors.primary[900]} width={18} height={18} />
            <input
              type="text"
              aria-label="Search"
              placeholder="Ara..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                background: "transparent",
                color: colors.primary[900],
              }}
            />
          </div>

          <div>
            <Select.Root
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <Select.Trigger
                aria-label="Sayfa boyutu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#fff",
                  border: `2px solid ${colors.primary[600]}`,
                  cursor: "pointer",
                  fontWeight: 500,
                  color: colors.primary[900],
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                }}
              >
                <Select.Value />
                <Select.Icon>
                  <ChevronDownIcon color={colors.primary[900]} />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  style={{
                    background: "#fff",
                    border: `2px solid ${colors.primary[600]}`,
                    borderRadius: 6,
                    zIndex: 1000,
                  }}
                >
                  <Select.Viewport>
                    {[5, 10, 20].map((s) => (
                      <Select.Item
                        key={s}
                        value={String(s)}
                        style={{
                          padding: "8px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          color: colors.primary[900],
                        }}
                      >
                        <Select.ItemText>{s} / sayfa</Select.ItemText>
                        <Select.ItemIndicator style={{ marginLeft: "auto" }}>
                          <CheckIcon color={colors.primary[900]} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

        {/* Main Table */}
        <div style={{ overflowX: "auto", marginBottom: 16, borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 6,
              fontSize: 'clamp(12px, 2.5vw, 14px)',
            }}
          >
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  style={{
                    background: colors.primary[900],
                    color: "#fff",
                  }}
                >
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        fontWeight: 600,
                        borderBottom: `1px solid ${colors.primary[700]}`,
                        fontSize: 'clamp(11px, 2vw, 13px)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                            style: {
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            },
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span>
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpIcon width={16} height={16} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDownIcon width={16} height={16} />
                            ) : null}
                          </span>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => handleRowClick(row.original)}
                    style={{
                      cursor: "pointer",
                      background: idx % 2 === 0 ? "#f9fafb" : "#fff",
                      borderBottom: `1px solid ${colors.primary[600]}`,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        colors.secondary[300];
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        idx % 2 === 0 ? "#f9fafb" : "#fff";
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Tooltip.Root key={cell.id}>
                        <Tooltip.Trigger asChild>
                          <td
                            style={{
                              padding: "12px",
                              fontSize: 14,
                              color: colors.primary[900],
                            }}
                          >
                            {typeof cell.getValue() === "number"
                              ? (cell.getValue() as number).toFixed(1)
                              : flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            style={{
                              background: colors.primary[900],
                              color: "#fff",
                              padding: "6px 10px",
                              borderRadius: 4,
                              fontSize: 12,
                              zIndex: 1000,
                            }}
                          >
                            {typeof cell.getValue() === "number"
                              ? `${(cell.getValue() as number).toFixed(2)}%`
                              : String(cell.getValue() || "")}
                            <Tooltip.Arrow style={{ fill: colors.primary[900] }} />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    ))}
                  </tr>

                  {/* Details Row */}
                  {selectedRow?.Program === row.original.Program && (
                    <tr style={{ background: "#f0f4f8" }}>
                      <td colSpan={6} style={{ padding: 16 }}>
                        <div style={{ marginBottom: 8 }}>
                          <h4 style={{ margin: "0 0 12px 0", color: colors.primary[900], fontSize: 14, fontWeight: 600 }}>
                            {row.original.Program} - Detaylı Dağılım
                          </h4>
                        </div>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: 12,
                        }}>
                          {[
                            { key: "kesinlikle_katilmiyorum", label: "Kesinlikle Katılmıyorum", color: "#DC2626" },
                            { key: "katilmiyorum", label: "Katılmıyorum", color: "#F87171" },
                            { key: "kararsizim", label: "Kararsızım", color: "#D97706" },
                            { key: "katiliyorum", label: "Katılıyorum", color: "#059669" },
                            { key: "kesinlikle_katiliyorum", label: "Kesinlikle Katılıyorum", color: "#047857" },
                          ].map((item) => (
                            <div
                              key={item.key}
                              style={{
                                padding: 12,
                                background: "#fff",
                                borderRadius: 6,
                                borderLeft: `4px solid ${item.color}`,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                              }}
                            >
                              <div style={{ fontSize: 11, color: colors.primary[700], marginBottom: 4, fontWeight: 500 }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>
                                {((row.original as any)[item.key] || 0).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
          <RadixButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </RadixButton>
          <RadixButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </RadixButton>
          <RadixButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </RadixButton>
          <RadixButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </RadixButton>
          <span style={{ marginLeft: 16, fontSize: 'clamp(12px, 2.5vw, 14px)', color: colors.primary[900] }}>
            <strong>{table.getState().pagination.pageIndex + 1}</strong> / {table.getPageCount()}
          </span>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
