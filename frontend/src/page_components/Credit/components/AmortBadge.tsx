interface BadgeProps {
  isFeasible: boolean;
  dbrPercent: number;
}

export function AmortBadge({ isFeasible, dbrPercent }: BadgeProps) {
  const bg = isFeasible ? "#f0fdf4" : "#fff1f2";
  const border = isFeasible ? "#86efac" : "#fca5a5";
  const textColor = isFeasible ? "#15803d" : "#b91c1c";
  const icon = isFeasible ? "✓" : "⚠";
  const label = isFeasible ? "Healthy" : "Risky";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "8px 14px",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 600,
            color: textColor,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: textColor }}>
          DBR {dbrPercent}%
        </p>
      </div>
    </div>
  );
}
