"use client";

export function NightfallIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nf-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="45%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="26" fill="url(#nf-grad)" />
      <circle cx="61" cy="43" r="18" fill="#08090d" />
      {/* Sun rays */}
      <line
        x1="16"
        y1="50"
        x2="22"
        y2="50"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="36"
        x2="23"
        y2="39"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="64"
        x2="23"
        y2="61"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Moon craters */}
      <circle cx="42" cy="42" r="1.2" fill="#e4e4e7" opacity={0.6} />
      <circle cx="36" cy="56" r="0.8" fill="#e4e4e7" opacity={0.4} />
    </svg>
  );
}

export function NightfallWordmark() {
  return (
    <span
      className="text-2xl font-bold tracking-tight bg-clip-text text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--nf-wm-start) 0%, var(--nf-wm-start) 55%, #8b5cf6 85%, #5b21b6 100%)",
      }}
    >
      nightfall
    </span>
  );
}

export function NightfallLogoFull() {
  return (
    <div className="flex items-center ">
      <NightfallIcon size={50} />
      <NightfallWordmark />
    </div>
  );
}
