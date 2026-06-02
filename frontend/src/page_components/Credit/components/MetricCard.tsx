interface MetricProps {
  label: string;
  value: string;
  sub: string;
  variant: "default" | "warning" | "success" | "info";
}

export function MetricCard({
  label,
  value,
  sub,
  variant = "default",
}: MetricProps) {
  const themes = {
    default: {
      bg: "#f8fafc",
      border: "#e2e8f0",
      labelColor: "#94a3b8",
      valueColor: "#0f172a",
      subColor: "#64748b",
    },
    warning: {
      bg: "#fff1f2",
      border: "#fca5a5",
      labelColor: "#94a3b8",
      valueColor: "#dc2626",
      subColor: "#ef4444",
    },
    success: {
      bg: "#f0fdf4",
      border: "#86efac",
      labelColor: "#94a3b8",
      valueColor: "#15803d",
      subColor: "#16a34a",
    },
    info: {
      bg: "#eff6ff",
      border: "#93c5fd",
      labelColor: "#94a3b8",
      valueColor: "#1d4ed8",
      subColor: "#3b82f6",
    },
  };

  const t = themes[variant] ?? themes.default;

  return (
    <div
      style={{
        background: t.bg,
        border: `0.5px solid ${t.border}`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: t.labelColor,
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "4px 0 2px",
          fontSize: 17,
          fontWeight: 700,
          color: t.valueColor,
        }}
      >
        {value}
      </p>
      <p style={{ margin: 0, fontSize: 11, color: t.subColor }}>{sub}</p>
    </div>
  );
}
