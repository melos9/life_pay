import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chart Design Lab",
  robots: { index: false, follow: false },
};

// =============================================================================
// Sample data
// =============================================================================

type Row = {
  age: number;
  assets: number;
  income: number;
  living: number;
  housing: number;
  other: number;
  children: number;
};

const RETIRE_AGE = 60;
const PENSION_AGE = 65;
const REQUIRED_ASSETS = 60_000_000;

function buildRows(): Row[] {
  const rows: Row[] = [];
  for (let age = 30; age <= 85; age++) {
    // Assets: rise then decline
    let assets: number;
    if (age <= RETIRE_AGE) {
      const t = (age - 30) / (RETIRE_AGE - 30);
      assets = 5_000_000 + (75_000_000 - 5_000_000) * Math.pow(t, 1.5);
    } else {
      const t = (age - RETIRE_AGE) / (85 - RETIRE_AGE);
      assets = 75_000_000 - (75_000_000 - 12_000_000) * Math.pow(t, 1.2);
    }

    // Income: working income → 0 at retire, pension thereafter
    let income = 0;
    if (age < RETIRE_AGE) {
      const t = (age - 30) / (RETIRE_AGE - 30);
      income = 5_500_000 + (6_800_000 - 5_500_000) * t;
    } else if (age >= PENSION_AGE) {
      income = 2_400_000;
    }

    const living = 3_000_000;
    const housing = age < 65 ? 1_500_000 : 800_000;
    const other = 600_000;
    let children = 0;
    if (age >= 32 && age <= 52) {
      // Child cost bump
      const t = (age - 32) / 20;
      children = 1_200_000 * Math.sin(t * Math.PI) + 200_000;
    }

    rows.push({ age, assets, income, living, housing, other, children });
  }
  return rows;
}

const ROWS = buildRows();

// =============================================================================
// Geometry helpers (shared)
// =============================================================================

type Box = { w: number; h: number; padL: number; padR: number; padT: number; padB: number };

function makeScale(box: Box, ages: number[], maxVal: number) {
  const innerW = box.w - box.padL - box.padR;
  const innerH = box.h - box.padT - box.padB;
  const minAge = ages[0];
  const maxAge = ages[ages.length - 1];
  const ageSpan = Math.max(1, maxAge - minAge);
  return {
    x: (age: number) => box.padL + ((age - minAge) / ageSpan) * innerW,
    y: (v: number) => box.padT + (1 - Math.max(0, v) / maxVal) * innerH,
    innerW,
    innerH,
    minAge,
    maxAge,
  };
}

// Catmull-Rom → cubic Bezier smoothing for a polyline
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  if (points.length === 2)
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  const d: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

function formatYen(v: number): string {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}億`;
  if (v >= 10_000) return `${Math.round(v / 10_000).toLocaleString("ja-JP")}万`;
  return `${Math.round(v).toLocaleString("ja-JP")}`;
}

// =============================================================================
// Theme A: Refined Minimal (mono + single accent)
// =============================================================================

function ThemeA_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 60, padR: 28, padT: 36, padB: 40 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="a-asset-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#e4e4e7" strokeWidth={t === 1 ? 1 : 0.5} />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#71717a" textAnchor="end" fontFamily="system-ui">
              {formatYen(v)}円
            </text>
          </g>
        );
      })}

      {/* Required line */}
      <line
        x1={box.padL}
        x2={box.w - box.padR}
        y1={scale.y(REQUIRED_ASSETS)}
        y2={scale.y(REQUIRED_ASSETS)}
        stroke="#0f172a"
        strokeOpacity="0.25"
        strokeDasharray="3 4"
      />
      <text x={box.w - box.padR} y={scale.y(REQUIRED_ASSETS) - 6} fontSize="10" fill="#475569" textAnchor="end" fontWeight="500">
        必要資産 6,000万
      </text>

      {/* Area + Line */}
      <path d={areaPath} fill="url(#a-asset-area)" />
      <path d={linePath} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Milestones */}
      {[{ age: RETIRE_AGE, label: "リタイア" }, { age: PENSION_AGE, label: "年金開始" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke="#a1a1aa" strokeDasharray="2 3" />
          <circle cx={scale.x(m.age)} cy={box.padT - 8} r="2.5" fill="#0f172a" />
          <text x={scale.x(m.age) + 6} y={box.padT - 6} fontSize="10" fill="#0f172a" fontWeight="500">{m.label}</text>
        </g>
      ))}

      {/* X labels */}
      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle" fontFamily="system-ui">
          {age}
        </text>
      ))}
    </svg>
  );
}

function ThemeA_Expense() {
  const box: Box = { w: 1000, h: 340, padL: 60, padR: 28, padT: 36, padB: 40 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#3f3f46" },
    { key: "housing", label: "住居費", color: "#71717a" },
    { key: "other", label: "その他", color: "#a1a1aa" },
    { key: "children", label: "子供費", color: "#d4d4d8" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxIncome = Math.max(...ROWS.map((r) => r.income));
  const maxStack = Math.max(...stacked.map((s) => s[series.length - 1]));
  const maxVal = Math.max(maxIncome, maxStack) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({
      x: scale.x(r.age),
      y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]),
    }));
    return `M ${tops.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#e4e4e7" strokeWidth={t === 1 ? 1 : 0.5} />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#71717a" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      {/* Stacked areas (monochrome) */}
      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} fillOpacity="0.85" />
      ))}

      {/* Income line: bold accent */}
      <path d={smoothPath(incomePts)} fill="none" stroke="#16a34a" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />

      {/* Retire marker */}
      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#a1a1aa" strokeDasharray="2 3" />

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme B: Editorial (serif numerals + annotation rail)
// =============================================================================

function ThemeB_Assets() {
  const box: Box = { w: 1000, h: 400, padL: 70, padR: 80, padT: 40, padB: 44 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;
  const peakIdx = ROWS.reduce((m, r, i) => (r.assets > ROWS[m].assets ? i : m), 0);

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="b-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y baseline only */}
      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#292524" strokeWidth="1" />

      {/* Required line w/ label */}
      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#a8a29e" strokeDasharray="4 4" />
      <text x={box.w - box.padR + 8} y={scale.y(REQUIRED_ASSETS) + 4} fontSize="11" fill="#78716c" fontStyle="italic">
        必要 6,000万
      </text>

      {/* Area + line */}
      <path d={areaPath} fill="url(#b-area)" />
      <path d={linePath} fill="none" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />

      {/* Peak callout */}
      <g>
        <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="4" fill="#9a3412" />
        <line x1={points[peakIdx].x} x2={points[peakIdx].x} y1={points[peakIdx].y - 8} y2={points[peakIdx].y - 38} stroke="#9a3412" />
        <text x={points[peakIdx].x + 6} y={points[peakIdx].y - 42} fontSize="11" fill="#7c2d12" fontWeight="600" fontFamily="Georgia, serif">
          ピーク {formatYen(ROWS[peakIdx].assets)}円
        </text>
      </g>

      {/* Milestones (vertical hairlines on baseline only) */}
      {[{ age: RETIRE_AGE, label: "リタイア" }, { age: PENSION_AGE, label: "年金" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.h - box.padB - 6} y2={box.h - box.padB + 6} stroke="#292524" />
          <text x={scale.x(m.age)} y={box.h - box.padB + 22} fontSize="10" fill="#292524" textAnchor="middle" fontWeight="500">{m.label}</text>
        </g>
      ))}

      {/* X year labels (sparse) */}
      {[30, 50, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - box.padB + 36} fontSize="11" fill="#78716c" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">
          {age}歳
        </text>
      ))}

      {/* Y label tucked top-left */}
      <text x={box.padL} y={box.padT - 14} fontSize="10" fill="#78716c" fontFamily="Georgia, serif" fontStyle="italic">
        Assets (yen)
      </text>
    </svg>
  );
}

function ThemeB_Expense() {
  const box: Box = { w: 1000, h: 360, padL: 70, padR: 80, padT: 40, padB: 44 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#fef3c7" },
    { key: "housing", label: "住居費", color: "#fde68a" },
    { key: "other", label: "その他", color: "#fcd34d" },
    { key: "children", label: "子供費", color: "#f59e0b" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]) }));
    return `M ${tops.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#292524" strokeWidth="1" />

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} />
      ))}

      <path d={smoothPath(incomePts)} fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#292524" strokeDasharray="2 3" opacity="0.5" />

      {[30, 50, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - box.padB + 22} fontSize="11" fill="#78716c" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">{age}歳</text>
      ))}
      <text x={box.padL} y={box.padT - 14} fontSize="10" fill="#78716c" fontFamily="Georgia, serif" fontStyle="italic">Income / Expense (yen)</text>
    </svg>
  );
}

// =============================================================================
// Theme C: Soft Gradient + Smooth
// =============================================================================

function ThemeC_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 60, padR: 28, padT: 36, padB: 40 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="c-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="c-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#f4f4f5" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#a1a1aa" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#fb7185" strokeDasharray="4 4" strokeOpacity="0.6" />
      <text x={box.w - box.padR} y={scale.y(REQUIRED_ASSETS) - 6} fontSize="10" fill="#e11d48" textAnchor="end" fontWeight="500">必要資産</text>

      <path d={areaPath} fill="url(#c-area)" />
      <path d={linePath} fill="none" stroke="url(#c-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {[{ age: RETIRE_AGE, label: "リタイア", color: "#f59e0b" }, { age: PENSION_AGE, label: "年金", color: "#10b981" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke={m.color} strokeDasharray="2 3" opacity="0.45" />
          <rect x={scale.x(m.age) - 22} y={box.padT - 18} width="44" height="14" rx="7" fill={m.color} fillOpacity="0.12" stroke={m.color} strokeOpacity="0.3" />
          <text x={scale.x(m.age)} y={box.padT - 7} fontSize="9" fill={m.color} textAnchor="middle" fontWeight="600">{m.label}</text>
        </g>
      ))}

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#a1a1aa" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

function ThemeC_Expense() {
  const box: Box = { w: 1000, h: 340, padL: 60, padR: 28, padT: 36, padB: 40 };
  const series: { key: keyof Row; label: string; gradId: string; from: string; to: string }[] = [
    { key: "living", label: "生活費", gradId: "c-grad-1", from: "#a5b4fc", to: "#818cf8" },
    { key: "housing", label: "住居費", gradId: "c-grad-2", from: "#6ee7b7", to: "#34d399" },
    { key: "other", label: "その他", gradId: "c-grad-3", from: "#fcd34d", to: "#fbbf24" },
    { key: "children", label: "子供費", gradId: "c-grad-4", from: "#fda4af", to: "#fb7185" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]) }));
    const topPath = smoothPath(tops);
    const reversedBots = [...bots].reverse();
    const botPath = reversedBots.map((p, i) => (i === 0 ? `L ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return `${topPath} ${botPath} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <defs>
        {series.map((s) => (
          <linearGradient key={s.gradId} id={s.gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.to} stopOpacity="0.85" />
            <stop offset="100%" stopColor={s.from} stopOpacity="0.55" />
          </linearGradient>
        ))}
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#f4f4f5" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#a1a1aa" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={`url(#${s.gradId})`} />
      ))}

      {/* Income line with subtle glow */}
      <path d={smoothPath(incomePts)} fill="none" stroke="#7c3aed" strokeWidth="6" strokeOpacity="0.18" strokeLinecap="round" />
      <path d={smoothPath(incomePts)} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#f59e0b" strokeDasharray="2 3" opacity="0.5" />

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#a1a1aa" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme D: Dark Premium
// =============================================================================

function ThemeD_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 60, padR: 28, padT: 36, padB: 40 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto rounded-xl">
      <defs>
        <linearGradient id="d-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <filter id="d-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width={box.w} height={box.h} fill="#0b1220" />

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#1e293b" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#fbbf24" strokeDasharray="3 4" strokeOpacity="0.6" />
      <text x={box.w - box.padR} y={scale.y(REQUIRED_ASSETS) - 6} fontSize="10" fill="#fbbf24" textAnchor="end" fontWeight="500">必要 6,000万</text>

      <path d={areaPath} fill="url(#d-area)" />
      <path d={linePath} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeOpacity="0.4" filter="url(#d-glow)" />
      <path d={linePath} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

      {[{ age: RETIRE_AGE, label: "リタイア", color: "#fbbf24" }, { age: PENSION_AGE, label: "年金", color: "#34d399" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke={m.color} strokeDasharray="2 3" opacity="0.4" />
          <text x={scale.x(m.age)} y={box.padT - 8} fontSize="10" fill={m.color} textAnchor="middle" fontWeight="600">{m.label}</text>
        </g>
      ))}

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#64748b" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

function ThemeD_Expense() {
  const box: Box = { w: 1000, h: 340, padL: 60, padR: 28, padT: 36, padB: 40 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#0ea5e9" },
    { key: "housing", label: "住居費", color: "#10b981" },
    { key: "other", label: "その他", color: "#f59e0b" },
    { key: "children", label: "子供費", color: "#f43f5e" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]) }));
    return `${smoothPath(tops)} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto rounded-xl">
      <defs>
        <filter id="d-glow2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width={box.w} height={box.h} fill="#0b1220" />

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#1e293b" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} fillOpacity="0.55" />
      ))}

      <path d={smoothPath(incomePts)} fill="none" stroke="#a855f7" strokeWidth="3" strokeOpacity="0.4" filter="url(#d-glow2)" />
      <path d={smoothPath(incomePts)} fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#fbbf24" strokeDasharray="2 3" opacity="0.4" />

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#64748b" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme E: Wall Street Journal (formal blue + serif + tick marks)
// =============================================================================

function ThemeE_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 70, padR: 40, padT: 40, padB: 44 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* Top tag line */}
      <line x1={box.padL} x2={box.w - box.padR} y1={20} y2={20} stroke="#0f172a" strokeWidth="2" />
      <text x={box.padL} y={14} fontSize="9" fill="#0f172a" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="1.5" fontWeight="700">
        NET FINANCIAL ASSETS — JPY
      </text>

      {/* Y grid (hairlines) */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#e5e7eb" />
            {/* Tick mark */}
            <line x1={box.padL - 4} x2={box.padL} y1={yy} y2={yy} stroke="#0f172a" />
            <text x={box.padL - 8} y={yy + 3} fontSize="10" fill="#0f172a" textAnchor="end" fontFamily="Georgia, 'Times New Roman', serif">
              {formatYen(v)}
            </text>
          </g>
        );
      })}

      {/* Required line */}
      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#dc2626" strokeDasharray="2 3" />
      <text x={box.w - box.padR + 4} y={scale.y(REQUIRED_ASSETS) + 3} fontSize="9" fill="#dc2626" fontFamily="Georgia, serif" fontStyle="italic">
        Required 60M
      </text>

      <path d={areaPath} fill="#1d4ed8" fillOpacity="0.10" />
      <path d={linePath} fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />

      {/* Milestones */}
      {[{ age: RETIRE_AGE, label: "Retire" }, { age: PENSION_AGE, label: "Pension" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke="#0f172a" strokeDasharray="1 3" opacity="0.5" />
          <text x={scale.x(m.age) + 4} y={box.padT + 12} fontSize="9" fill="#0f172a" fontFamily="Georgia, serif" letterSpacing="0.5">{m.label}</text>
        </g>
      ))}

      {/* X axis line + ticks */}
      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#0f172a" />
      {[30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85].map((age) => (
        <g key={age}>
          <line x1={scale.x(age)} x2={scale.x(age)} y1={box.h - box.padB} y2={box.h - box.padB + 4} stroke="#0f172a" />
          {age % 10 === 0 || age === 85 ? (
            <text x={scale.x(age)} y={box.h - box.padB + 18} fontSize="10" fill="#0f172a" textAnchor="middle" fontFamily="Georgia, serif">{age}</text>
          ) : null}
        </g>
      ))}
      <text x={(box.padL + box.w - box.padR) / 2} y={box.h - 6} fontSize="9" fill="#525252" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">
        AGE
      </text>
    </svg>
  );
}

function ThemeE_Expense() {
  const box: Box = { w: 1000, h: 340, padL: 70, padR: 40, padT: 40, padB: 44 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "Living", color: "#1e40af" },
    { key: "housing", label: "Housing", color: "#2563eb" },
    { key: "other", label: "Other", color: "#60a5fa" },
    { key: "children", label: "Children", color: "#93c5fd" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]) }));
    return `M ${tops.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <line x1={box.padL} x2={box.w - box.padR} y1={20} y2={20} stroke="#0f172a" strokeWidth="2" />
      <text x={box.padL} y={14} fontSize="9" fill="#0f172a" fontFamily="Georgia, serif" letterSpacing="1.5" fontWeight="700">
        ANNUAL INCOME & EXPENSE — JPY
      </text>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#e5e7eb" />
            <line x1={box.padL - 4} x2={box.padL} y1={yy} y2={yy} stroke="#0f172a" />
            <text x={box.padL - 8} y={yy + 3} fontSize="10" fill="#0f172a" textAnchor="end" fontFamily="Georgia, serif">{formatYen(v)}</text>
          </g>
        );
      })}

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} fillOpacity="0.9" />
      ))}

      <path d={smoothPath(incomePts)} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#0f172a" strokeDasharray="1 3" opacity="0.5" />

      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#0f172a" />
      {[30, 40, 50, 60, 70, 85].map((age) => (
        <g key={age}>
          <line x1={scale.x(age)} x2={scale.x(age)} y1={box.h - box.padB} y2={box.h - box.padB + 4} stroke="#0f172a" />
          <text x={scale.x(age)} y={box.h - box.padB + 18} fontSize="10" fill="#0f172a" textAnchor="middle" fontFamily="Georgia, serif">{age}</text>
        </g>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme F: Economist (red accent + small caps + dotted grid)
// =============================================================================

function ThemeF_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 30, padR: 80, padT: 50, padB: 44 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* Economist red tag */}
      <rect x={0} y={0} width={36} height={36} fill="#e3120b" />

      <text x={48} y={20} fontSize="11" fill="#1f2937" letterSpacing="2" fontWeight="700">
        ASSETS BY AGE
      </text>
      <text x={48} y={36} fontSize="10" fill="#6b7280" fontStyle="italic">
        Projection, ¥ million
      </text>

      {/* Dotted Y grid; labels on the right */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#d1d5db" strokeDasharray="1 3" />
            <text x={box.w - box.padR + 6} y={yy + 3} fontSize="10" fill="#374151" textAnchor="start">
              {Math.round(v / 1_000_000)}
            </text>
          </g>
        );
      })}

      {/* Required line */}
      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#e3120b" strokeDasharray="3 3" strokeOpacity="0.7" />

      <path d={linePath} fill="none" stroke="#e3120b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* End-of-line label */}
      <g>
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#e3120b" />
        <text x={box.w - box.padR + 6} y={points[points.length - 1].y + 3} fontSize="10" fill="#e3120b" fontWeight="600">
          資産
        </text>
      </g>

      {/* Milestones */}
      {[{ age: RETIRE_AGE, label: "Retire" }, { age: PENSION_AGE, label: "Pension" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke="#1f2937" strokeOpacity="0.3" strokeDasharray="2 3" />
          <text x={scale.x(m.age)} y={box.padT - 6} fontSize="9" fill="#1f2937" textAnchor="middle" letterSpacing="1" fontWeight="600">{m.label.toUpperCase()}</text>
        </g>
      ))}

      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#1f2937" />
      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - box.padB + 18} fontSize="10" fill="#374151" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

function ThemeF_Expense() {
  const box: Box = { w: 1000, h: 340, padL: 30, padR: 100, padT: 50, padB: 44 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "Living", color: "#7c1d1d" },
    { key: "housing", label: "Housing", color: "#b91c1c" },
    { key: "other", label: "Other", color: "#ef4444" },
    { key: "children", label: "Children", color: "#fca5a5" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(stacked[i][idx]) }));
    const bots = ROWS.map((r, i) => ({ x: scale.x(r.age), y: scale.y(idx === 0 ? 0 : stacked[i][idx - 1]) }));
    return `M ${tops.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));
  const incomeEnd = incomePts[incomePts.length - 1];
  const stackEndY = scale.y(stacked[stacked.length - 1][series.length - 1]);

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <rect x={0} y={0} width={36} height={36} fill="#e3120b" />
      <text x={48} y={20} fontSize="11" fill="#1f2937" letterSpacing="2" fontWeight="700">INCOME & EXPENSE</text>
      <text x={48} y={36} fontSize="10" fill="#6b7280" fontStyle="italic">¥ million per year</text>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#d1d5db" strokeDasharray="1 3" />
            <text x={box.w - box.padR + 6} y={yy + 3} fontSize="10" fill="#374151">{Math.round(v / 1_000_000)}</text>
          </g>
        );
      })}

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} fillOpacity="0.85" />
      ))}

      <path d={smoothPath(incomePts)} fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />

      {/* End-of-line labels */}
      <g>
        <text x={box.w - box.padR + 6} y={incomeEnd.y + 3} fontSize="10" fill="#1f2937" fontWeight="600">収入</text>
        <text x={box.w - box.padR + 6} y={stackEndY + 3} fontSize="10" fill="#b91c1c" fontWeight="600">支出</text>
      </g>

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#1f2937" strokeOpacity="0.3" strokeDasharray="2 3" />
      <text x={scale.x(RETIRE_AGE)} y={box.padT - 6} fontSize="9" fill="#1f2937" textAnchor="middle" letterSpacing="1" fontWeight="600">RETIRE</text>

      <line x1={box.padL} x2={box.w - box.padR} y1={box.h - box.padB} y2={box.h - box.padB} stroke="#1f2937" />
      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - box.padB + 18} fontSize="10" fill="#374151" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme G: Bar + Line Hybrid (yearly bars for expense)
// =============================================================================

function ThemeG_Assets() {
  const box: Box = { w: 1000, h: 380, padL: 60, padR: 28, padT: 36, padB: 40 };
  const maxVal = 90_000_000;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);
  const points = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.assets) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${box.padT + scale.innerH} L ${points[0].x} ${box.padT + scale.innerH} Z`;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="g-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#f1f5f9" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      <line x1={box.padL} x2={box.w - box.padR} y1={scale.y(REQUIRED_ASSETS)} y2={scale.y(REQUIRED_ASSETS)} stroke="#f97316" strokeDasharray="4 4" strokeOpacity="0.7" />
      <text x={box.w - box.padR} y={scale.y(REQUIRED_ASSETS) - 6} fontSize="10" fill="#c2410c" textAnchor="end" fontWeight="500">必要資産</text>

      <path d={areaPath} fill="url(#g-area)" />
      <path d={linePath} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />

      {/* Dot markers every 5 yrs */}
      {ROWS.filter((r) => r.age % 5 === 0).map((r) => (
        <circle key={r.age} cx={scale.x(r.age)} cy={scale.y(r.assets)} r="3" fill="white" stroke="#0f766e" strokeWidth="1.5" />
      ))}

      {[{ age: RETIRE_AGE, label: "リタイア" }, { age: PENSION_AGE, label: "年金" }].map((m) => (
        <g key={m.age}>
          <line x1={scale.x(m.age)} x2={scale.x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke="#64748b" strokeDasharray="2 3" opacity="0.4" />
          <text x={scale.x(m.age)} y={box.padT - 6} fontSize="10" fill="#334155" textAnchor="middle" fontWeight="500">{m.label}</text>
        </g>
      ))}

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#64748b" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

function ThemeG_Expense() {
  const box: Box = { w: 1000, h: 360, padL: 60, padR: 28, padT: 36, padB: 40 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#0ea5e9" },
    { key: "housing", label: "住居費", color: "#14b8a6" },
    { key: "other", label: "その他", color: "#eab308" },
    { key: "children", label: "子供費", color: "#f97316" },
  ];
  const stacked = ROWS.map((r) => {
    let acc = 0;
    return series.map((s) => {
      acc += Math.max(0, r[s.key] as number);
      return acc;
    });
  });
  const maxVal = Math.max(...stacked.map((s) => s[series.length - 1]), ...ROWS.map((r) => r.income)) * 1.05;
  const scale = makeScale(box, ROWS.map((r) => r.age), maxVal);

  // Bar width (per year)
  const barW = (scale.innerW / ROWS.length) * 0.75;

  const incomePts = ROWS.map((r) => ({ x: scale.x(r.age), y: scale.y(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = maxVal * (1 - t);
        const yy = box.padT + t * scale.innerH;
        return (
          <g key={t}>
            <line x1={box.padL} x2={box.w - box.padR} y1={yy} y2={yy} stroke="#f1f5f9" />
            <text x={box.padL - 10} y={yy + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatYen(v)}円</text>
          </g>
        );
      })}

      {/* Stacked bars (one per year) */}
      {ROWS.map((r, i) => {
        const cx = scale.x(r.age);
        let prev = 0;
        return (
          <g key={r.age}>
            {series.map((s, idx) => {
              const v = Math.max(0, r[s.key] as number);
              const top = scale.y(prev + v);
              const bot = scale.y(prev);
              prev += v;
              return v > 0 ? (
                <rect
                  key={s.key}
                  x={cx - barW / 2}
                  y={top}
                  width={barW}
                  height={Math.max(0, bot - top)}
                  fill={s.color}
                  fillOpacity={idx === 0 ? 0.9 : 0.8}
                  rx={idx === series.length - 1 ? 1.5 : 0}
                />
              ) : null;
            })}
          </g>
        );
      })}

      <path d={smoothPath(incomePts)} fill="none" stroke="#1e293b" strokeWidth="2.25" strokeLinecap="round" />

      <line x1={scale.x(RETIRE_AGE)} x2={scale.x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#64748b" strokeDasharray="2 3" opacity="0.5" />
      <text x={scale.x(RETIRE_AGE)} y={box.padT - 6} fontSize="10" fill="#334155" textAnchor="middle" fontWeight="500">リタイア</text>

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={scale.x(age)} y={box.h - 14} fontSize="10" fill="#64748b" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme H: Diverging Bars (Income up / Expense down, savings highlighted)
// =============================================================================

function ThemeH_Expense() {
  const box: Box = { w: 1000, h: 380, padL: 64, padR: 28, padT: 28, padB: 40 };
  const expense = ROWS.map((r) => r.living + r.housing + r.other + r.children);
  const income = ROWS.map((r) => r.income);
  const maxV = Math.max(...expense, ...income) * 1.05;
  const innerW = box.w - box.padL - box.padR;
  const innerH = box.h - box.padT - box.padB;
  const halfH = innerH / 2;
  const midY = box.padT + halfH;
  const ages = ROWS.map((r) => r.age);
  const minAge = ages[0];
  const ageSpan = ages[ages.length - 1] - minAge;
  const x = (age: number) => box.padL + ((age - minAge) / ageSpan) * innerW;
  const yUp = (v: number) => midY - (v / maxV) * halfH;
  const yDn = (v: number) => midY + (v / maxV) * halfH;
  const barW = (innerW / ROWS.length) * 0.7;

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* mid axis */}
      <line x1={box.padL} x2={box.w - box.padR} y1={midY} y2={midY} stroke="#0f172a" strokeWidth="1" />
      {/* y grid (symmetric) */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={box.padL} x2={box.w - box.padR} y1={midY - t * halfH} y2={midY - t * halfH} stroke="#e4e4e7" />
          <line x1={box.padL} x2={box.w - box.padR} y1={midY + t * halfH} y2={midY + t * halfH} stroke="#e4e4e7" />
          <text x={box.padL - 8} y={midY - t * halfH + 3} fontSize="10" fill="#71717a" textAnchor="end">{formatYen(maxV * t)}</text>
          <text x={box.padL - 8} y={midY + t * halfH + 3} fontSize="10" fill="#71717a" textAnchor="end">{formatYen(maxV * t)}</text>
        </g>
      ))}
      {/* up/down labels */}
      <text x={box.padL} y={box.padT + 10} fontSize="10" fill="#15803d" fontWeight="600">▲ 収入</text>
      <text x={box.padL} y={box.h - box.padB - 4} fontSize="10" fill="#b91c1c" fontWeight="600">▼ 支出</text>

      {/* bars */}
      {ROWS.map((r, i) => {
        const cx = x(r.age);
        const inc = income[i];
        const exp = expense[i];
        const surplus = inc - exp;
        const incColor = surplus >= 0 ? "#16a34a" : "#a3a3a3";
        const expColor = surplus >= 0 ? "#e4e4e7" : "#ef4444";
        return (
          <g key={r.age}>
            {inc > 0 && (
              <rect x={cx - barW / 2} y={yUp(inc)} width={barW} height={midY - yUp(inc)} fill={incColor} fillOpacity="0.85" />
            )}
            {exp > 0 && (
              <rect x={cx - barW / 2} y={midY} width={barW} height={yDn(exp) - midY} fill={expColor} fillOpacity="0.85" />
            )}
          </g>
        );
      })}

      {/* retire/pension markers */}
      {[{ age: RETIRE_AGE, label: "リタイア" }, { age: PENSION_AGE, label: "年金" }].map((m) => (
        <g key={m.age}>
          <line x1={x(m.age)} x2={x(m.age)} y1={box.padT} y2={box.h - box.padB} stroke="#0f172a" strokeOpacity="0.25" strokeDasharray="2 3" />
          <text x={x(m.age) + 4} y={box.padT + 10} fontSize="10" fill="#0f172a" fontWeight="500">{m.label}</text>
        </g>
      ))}

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={x(age)} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle">{age}</text>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme I: 100% Stacked Composition (構成比 + 絶対額ミニチャート)
// =============================================================================

function ThemeI_Expense() {
  const box: Box = { w: 1000, h: 360, padL: 60, padR: 120, padT: 28, padB: 40 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#6366f1" },
    { key: "housing", label: "住居費", color: "#06b6d4" },
    { key: "other", label: "その他", color: "#f59e0b" },
    { key: "children", label: "子供費", color: "#ec4899" },
  ];
  const innerW = box.w - box.padL - box.padR;
  const innerH = box.h - box.padT - box.padB;
  const ages = ROWS.map((r) => r.age);
  const minAge = ages[0];
  const ageSpan = ages[ages.length - 1] - minAge;
  const x = (age: number) => box.padL + ((age - minAge) / ageSpan) * innerW;
  const yTop = box.padT;
  const yBot = box.padT + innerH;

  // pre-compute cumulative ratios
  const ratios = ROWS.map((r) => {
    const total = series.reduce((s, c) => s + Math.max(0, r[c.key] as number), 0) || 1;
    let acc = 0;
    return series.map((c) => {
      acc += Math.max(0, r[c.key] as number) / total;
      return acc;
    });
  });

  function areaPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: x(r.age), y: yBot - (idx === 0 ? 0 : ratios[i][idx - 1]) * innerH }));
    const bots = ROWS.map((r, i) => ({ x: x(r.age), y: yBot - ratios[i][idx] * innerH }));
    return `M ${tops.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${[...bots].reverse().map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* horizontal % ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={box.padL} x2={box.w - box.padR} y1={yBot - t * innerH} y2={yBot - t * innerH} stroke="#f1f5f9" />
          <text x={box.padL - 8} y={yBot - t * innerH + 3} fontSize="10" fill="#71717a" textAnchor="end">{Math.round(t * 100)}%</text>
        </g>
      ))}

      {series.map((s, idx) => (
        <path key={s.key} d={areaPath(idx)} fill={s.color} fillOpacity="0.85" />
      ))}

      {/* retire marker */}
      <line x1={x(RETIRE_AGE)} x2={x(RETIRE_AGE)} y1={yTop} y2={yBot} stroke="#0f172a" strokeOpacity="0.4" strokeDasharray="3 3" />
      <text x={x(RETIRE_AGE)} y={yTop - 6} fontSize="10" fill="#0f172a" textAnchor="middle" fontWeight="500">リタイア</text>

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={x(age)} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle">{age}</text>
      ))}

      {/* legend on right */}
      {series.map((s, idx) => (
        <g key={s.key} transform={`translate(${box.w - box.padR + 12}, ${yTop + 8 + idx * 20})`}>
          <rect width="10" height="10" fill={s.color} />
          <text x="14" y="9" fontSize="11" fill="#3f3f46">{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

// =============================================================================
// Theme J: Stream (Centered baseline ribbon)
// =============================================================================

function ThemeJ_Expense() {
  const box: Box = { w: 1000, h: 360, padL: 60, padR: 28, padT: 36, padB: 40 };
  const series: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#0ea5e9" },
    { key: "housing", label: "住居費", color: "#22c55e" },
    { key: "other", label: "その他", color: "#eab308" },
    { key: "children", label: "子供費", color: "#f43f5e" },
  ];
  const innerW = box.w - box.padL - box.padR;
  const innerH = box.h - box.padT - box.padB;
  const midY = box.padT + innerH / 2;
  const ages = ROWS.map((r) => r.age);
  const minAge = ages[0];
  const ageSpan = ages[ages.length - 1] - minAge;
  const x = (age: number) => box.padL + ((age - minAge) / ageSpan) * innerW;

  const totals = ROWS.map((r) => series.reduce((s, c) => s + Math.max(0, r[c.key] as number), 0));
  const maxTotal = Math.max(...totals, ...ROWS.map((r) => r.income)) * 1.05;
  const scaleV = (v: number) => (v / maxTotal) * (innerH / 2);

  // For each series, compute top/bottom around center, stacked symmetrically
  const offsets = ROWS.map((r) => {
    const half = totals[ROWS.indexOf(r)] / 2;
    let cur = -half;
    return series.map((c) => {
      const v = Math.max(0, r[c.key] as number);
      const lo = cur;
      cur += v;
      const hi = cur;
      return { lo, hi };
    });
  });

  function ribbonPath(idx: number) {
    const tops = ROWS.map((r, i) => ({ x: x(r.age), y: midY - scaleV(offsets[i][idx].hi) }));
    const bots = ROWS.map((r, i) => ({ x: x(r.age), y: midY - scaleV(offsets[i][idx].lo) }));
    const top = smoothPath(tops).replace(/^M/, "M");
    const botRev = [...bots].reverse();
    const botStr = botRev.map((p, i) => (i === 0 ? `L ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return `${top} ${botStr} Z`;
  }

  // Income as overlaid smooth line (above)
  const incomePts = ROWS.map((r) => ({ x: x(r.age), y: midY - scaleV(r.income) }));

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* center axis */}
      <line x1={box.padL} x2={box.w - box.padR} y1={midY} y2={midY} stroke="#e4e4e7" />

      {series.map((s, idx) => (
        <path key={s.key} d={ribbonPath(idx)} fill={s.color} fillOpacity="0.78" />
      ))}

      <path d={smoothPath(incomePts)} fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="4 3" />
      <text x={box.w - box.padR} y={midY - scaleV(ROWS[ROWS.length - 1].income) - 6} fontSize="10" fill="#0f172a" textAnchor="end" fontWeight="600">収入</text>

      <line x1={x(RETIRE_AGE)} x2={x(RETIRE_AGE)} y1={box.padT} y2={box.h - box.padB} stroke="#0f172a" strokeOpacity="0.3" strokeDasharray="2 3" />
      <text x={x(RETIRE_AGE)} y={box.padT - 4} fontSize="10" fill="#0f172a" textAnchor="middle" fontWeight="500">リタイア</text>

      {[30, 40, 50, 60, 70, 85].map((age) => (
        <text key={age} x={x(age)} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle">{age}</text>
      ))}

      {/* legend */}
      <g transform={`translate(${box.padL}, ${box.padT - 14})`}>
        {series.map((s, i) => (
          <g key={s.key} transform={`translate(${i * 88}, 0)`}>
            <rect width="10" height="10" fill={s.color} />
            <text x="14" y="9" fontSize="11" fill="#3f3f46">{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// =============================================================================
// Theme K: Heatmap Matrix (年 × カテゴリ、濃度で額)
// =============================================================================

function ThemeK_Expense() {
  const box: Box = { w: 1000, h: 360, padL: 84, padR: 28, padT: 36, padB: 40 };
  const rows: { key: keyof Row; label: string; color: string }[] = [
    { key: "living", label: "生活費", color: "#6366f1" },
    { key: "housing", label: "住居費", color: "#06b6d4" },
    { key: "other", label: "その他", color: "#f59e0b" },
    { key: "children", label: "子供費", color: "#ec4899" },
  ];
  const incomeRow = { label: "収入", color: "#10b981" };
  const allRows = [incomeRow, ...rows];

  const innerW = box.w - box.padL - box.padR;
  const innerH = box.h - box.padT - box.padB;
  const cellH = innerH / allRows.length;
  const ages = ROWS.map((r) => r.age);
  const minAge = ages[0];
  const ageSpan = ages[ages.length - 1] - minAge + 1;
  const cellW = innerW / ROWS.length;

  // max per row for normalized opacity
  const maxIncome = Math.max(...ROWS.map((r) => r.income));
  const maxByKey: Record<string, number> = {};
  rows.forEach((r) => {
    maxByKey[r.key as string] = Math.max(...ROWS.map((row) => row[r.key] as number));
  });

  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="w-full h-auto">
      {/* row labels */}
      {allRows.map((r, ri) => (
        <text key={r.label} x={box.padL - 10} y={box.padT + cellH * ri + cellH / 2 + 3} fontSize="11" fill="#3f3f46" textAnchor="end" fontWeight="500">{r.label}</text>
      ))}

      {/* cells: income row */}
      {ROWS.map((row, ci) => {
        const op = maxIncome > 0 ? row.income / maxIncome : 0;
        return (
          <rect key={`inc-${row.age}`} x={box.padL + ci * cellW} y={box.padT} width={cellW - 0.5} height={cellH - 1.5} fill={incomeRow.color} fillOpacity={op * 0.9} />
        );
      })}

      {/* cells: expense rows */}
      {rows.map((rDef, ri) => (
        <g key={rDef.key as string}>
          {ROWS.map((row, ci) => {
            const v = row[rDef.key] as number;
            const m = maxByKey[rDef.key as string] || 1;
            const op = v / m;
            return (
              <rect key={`${rDef.key as string}-${row.age}`} x={box.padL + ci * cellW} y={box.padT + cellH * (ri + 1)} width={cellW - 0.5} height={cellH - 1.5} fill={rDef.color} fillOpacity={op * 0.9} />
            );
          })}
        </g>
      ))}

      {/* x ticks */}
      {[30, 40, 50, 60, 70, 85].map((age) => {
        const cx = box.padL + ((age - minAge) / ageSpan) * innerW + cellW / 2;
        return <text key={age} x={cx} y={box.h - 14} fontSize="10" fill="#71717a" textAnchor="middle">{age}</text>;
      })}

      {/* retire marker */}
      <line x1={box.padL + ((RETIRE_AGE - minAge) / ageSpan) * innerW} x2={box.padL + ((RETIRE_AGE - minAge) / ageSpan) * innerW} y1={box.padT - 4} y2={box.h - box.padB + 4} stroke="#0f172a" strokeOpacity="0.5" strokeDasharray="2 3" />
      <text x={box.padL + ((RETIRE_AGE - minAge) / ageSpan) * innerW} y={box.padT - 8} fontSize="10" fill="#0f172a" textAnchor="middle" fontWeight="500">リタイア</text>
    </svg>
  );
}

// =============================================================================
// Theme wrappers (card layouts)
// =============================================================================

function ThemeCard({
  id,
  title,
  tagline,
  features,
  bgClass,
  textClass,
  subTextClass,
  children,
}: {
  id: string;
  title: string;
  tagline: string;
  features: string[];
  bgClass?: string;
  textClass?: string;
  subTextClass?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className={`text-xl font-semibold ${textClass ?? "text-zinc-900"}`}>{title}</h2>
          <p className={`text-sm mt-0.5 ${subTextClass ?? "text-zinc-500"}`}>{tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5 text-[11px]">
          {features.map((f) => (
            <li key={f} className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className={`rounded-2xl border p-5 lg:p-6 space-y-6 ${bgClass ?? "bg-white border-zinc-200"}`}>
        {children}
      </div>
    </section>
  );
}

function SubLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xs uppercase tracking-wider font-semibold ${className ?? "text-zinc-500"}`}>{children}</h3>;
}

// =============================================================================
// Page
// =============================================================================

export default function DesignLabPage() {
  const themes = [
    { id: "a", label: "A. Refined Minimal" },
    { id: "b", label: "B. Editorial" },
    { id: "c", label: "C. Soft Gradient" },
    { id: "d", label: "D. Dark Premium" },
    { id: "e", label: "E. WSJ" },
    { id: "f", label: "F. Economist" },
    { id: "g", label: "G. Bar+Line" },
    { id: "h", label: "H. Diverging（収支のみ）" },
    { id: "i", label: "I. 100% Stacked（収支のみ）" },
    { id: "j", label: "J. Stream（収支のみ）" },
    { id: "k", label: "K. Heatmap（収支のみ）" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header className="space-y-2">
        <p className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">← シミュレーターに戻る</Link>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">グラフ デザイン案</h1>
        <p className="text-sm text-zinc-600 max-w-2xl">
          現在のグラフを刷新するための 7 つの方向性を、サンプルデータでモックアップしています。
          採用したいテーマ（A〜G）を教えてください。組み合わせ（例: 「Aのレイアウト＋Cの配色」など）も可能です。
        </p>
        <nav className="flex flex-wrap gap-2 pt-2">
          {themes.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700">
              {t.label}
            </a>
          ))}
        </nav>
      </header>

      <ThemeCard
        id="a"
        title="A. Refined Minimal"
        tagline="モノクロ＋アクセント1色。罫線を極限まで削り、データに視線を集中。"
        features={["モノクロ基調", "薄い罫線", "上部マイルストーン", "面塗りはごく薄く"]}
      >
        <div>
          <SubLabel>資産推移</SubLabel>
          <div className="mt-2"><ThemeA_Assets /></div>
        </div>
        <div className="border-t border-zinc-100 pt-5">
          <SubLabel>収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeA_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="b"
        title="B. Editorial"
        tagline="雑誌/新聞風。セリフ書体の数値ラベルとピーク注釈で物語性を持たせる。"
        features={["セリフ書体", "ピーク注釈", "ベースライン強調", "余白多め"]}
        bgClass="bg-stone-50 border-stone-200"
      >
        <div>
          <SubLabel className="text-stone-600">Assets — 資産推移</SubLabel>
          <div className="mt-2"><ThemeB_Assets /></div>
        </div>
        <div className="border-t border-stone-200 pt-5">
          <SubLabel className="text-stone-600">Income / Expense — 収入と支出</SubLabel>
          <div className="mt-2"><ThemeB_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="c"
        title="C. Soft Gradient"
        tagline="パステル×グラデーション、なめらかなベジエ曲線。やさしくモダンな印象。"
        features={["グラデーション塗り", "スムージング曲線", "ピル型マイルストーン", "やや厚めの線"]}
      >
        <div>
          <SubLabel>資産推移</SubLabel>
          <div className="mt-2"><ThemeC_Assets /></div>
        </div>
        <div className="border-t border-zinc-100 pt-5">
          <SubLabel>収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeC_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="d"
        title="D. Dark Premium"
        tagline="ダーク背景×ネオン系アクセント。グロー効果でフィンテック/プレミアム感。"
        features={["ダーク背景", "グロー", "高彩度アクセント", "高コントラスト"]}
        bgClass="bg-[#0b1220] border-[#1e293b]"
        textClass="text-zinc-100"
        subTextClass="text-zinc-400"
      >
        <div>
          <SubLabel className="text-zinc-400">資産推移</SubLabel>
          <div className="mt-2"><ThemeD_Assets /></div>
        </div>
        <div className="border-t border-[#1e293b] pt-5">
          <SubLabel className="text-zinc-400">収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeD_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="e"
        title="E. Wall Street Journal"
        tagline="フォーマルな経済紙風。セリフ書体・ティックマーク・上部の小キャプス見出しで権威感。"
        features={["セリフ書体", "ティックマーク", "上部キャプション", "深いブルー基調"]}
      >
        <div>
          <SubLabel>資産推移</SubLabel>
          <div className="mt-2"><ThemeE_Assets /></div>
        </div>
        <div className="border-t border-zinc-100 pt-5">
          <SubLabel>収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeE_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="f"
        title="F. Economist"
        tagline="The Economist 風。象徴的な赤タグ、点線グリッド、ライン末尾ラベル、軸ラベルは右側。"
        features={["赤タグ", "点線グリッド", "右側Y軸", "ライン末尾に直接ラベル"]}
        bgClass="bg-stone-50 border-stone-200"
      >
        <div>
          <SubLabel className="text-stone-600">資産推移</SubLabel>
          <div className="mt-2"><ThemeF_Assets /></div>
        </div>
        <div className="border-t border-stone-200 pt-5">
          <SubLabel className="text-stone-600">収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeF_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="g"
        title="G. Bar + Line Hybrid"
        tagline="支出を年次の積み上げ縦棒に。各年の内訳が明確で、収入の線との対比が読みやすい。"
        features={["積み上げ縦棒", "年次の解像度", "資産は面+ドット", "対比が明快"]}
      >
        <div>
          <SubLabel>資産推移（面＋5年ドット）</SubLabel>
          <div className="mt-2"><ThemeG_Assets /></div>
        </div>
        <div className="border-t border-zinc-100 pt-5">
          <SubLabel>収入と支出の推移（積み上げ縦棒＋収入線）</SubLabel>
          <div className="mt-2"><ThemeG_Expense /></div>
        </div>
      </ThemeCard>

      <div className="pt-6">
        <h2 className="text-base font-semibold text-zinc-900">収入と支出の推移 — 追加デザイン案</h2>
        <p className="text-sm text-zinc-500 mt-1">資産推移は変えず、収支グラフだけ別アプローチを試したい場合の候補です。</p>
      </div>

      <ThemeCard
        id="h"
        title="H. Diverging（収入↑ / 支出↓）"
        tagline="中央軸から収入を上、支出を下に伸ばす分岐縦棒。黒字/赤字が一目で判別できる。"
        features={["中央軸", "上下分岐", "黒字/赤字の自動色分け", "年単位の縦棒"]}
      >
        <div>
          <SubLabel>収入と支出の推移</SubLabel>
          <div className="mt-2"><ThemeH_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="i"
        title="I. 100% Stacked（構成比）"
        tagline="支出を100%に正規化した積み上げ。年齢ごとの『何にお金がかかっているか』の構成変化が見やすい。"
        features={["構成比100%", "面の流れ", "右側に凡例", "額は別途表示前提"]}
      >
        <div>
          <SubLabel>支出の構成比</SubLabel>
          <div className="mt-2"><ThemeI_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="j"
        title="J. Stream（中央ベースライン）"
        tagline="ストリームグラフ。中央線から上下対称に広がり、流れるような有機的な印象。収入は破線で重ねる。"
        features={["中央ベースライン", "シンメトリック", "なめらかな曲線", "アートよりの表現"]}
        bgClass="bg-stone-50 border-stone-200"
      >
        <div>
          <SubLabel className="text-stone-600">収入と支出の流れ</SubLabel>
          <div className="mt-2"><ThemeJ_Expense /></div>
        </div>
      </ThemeCard>

      <ThemeCard
        id="k"
        title="K. Heatmap Matrix（年×カテゴリ）"
        tagline="年齢を横軸、カテゴリを縦軸に取り、色の濃度で額を表現。長期の傾向と『山場』が直感的。"
        features={["濃度=額", "年×カテゴリ", "リタイア境界が明瞭", "コンパクト"]}
      >
        <div>
          <SubLabel>収入と支出（濃度＝額）</SubLabel>
          <div className="mt-2"><ThemeK_Expense /></div>
        </div>
      </ThemeCard>

      <footer className="text-xs text-zinc-500 pt-4 border-t border-zinc-100">
        ※ 表示はサンプルデータです。インタラクション（ホバー時のツールチップ等）は本実装時に追加します。
      </footer>
    </div>
  );
}
