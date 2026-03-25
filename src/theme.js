export const colors = {
  bg: "#0a0c12",
  card: "#12141c",
  cardHover: "#161824",
  bd: "#1c1f2e",
  inp: "#181b26",
  inpBd: "#262a3a",
  focus: "#4a6cf7",
  t1: "#ECEBE8",
  t2: "#9590a0",
  t3: "#5e5a6e",
  t4: "#3d3a4e",

  // Slot mode (blue)
  acc: "#4a6cf7",
  accL: "#93b4ff",
  accBg: "#0e1428",
  accBd: "#1e2d58",

  // Fishing mode (cyan)
  fish: "#06b6d4",
  fishL: "#67e8f9",
  fishBg: "#0a1e24",
  fishBd: "#164e63",

  // Casual mode (purple)
  casual: "#a855f7",
  casualL: "#c084fc",
  casualBg: "#180e28",
  casualBd: "#3b1e6e",

  // Status
  grn: "#10b981",
  grnL: "#34d399",
  grnBg: "#0a2418",
  grnBd: "#1a5438",
  ylw: "#fbbf24",
  ylwBg: "#1a1600",
  ylwBd: "#33300a",
  org: "#fb923c",
  red: "#ef4444",
};

// Get accent color set for a mode
export function getModeColors(mode) {
  switch (mode) {
    case "fishing":
      return { main: colors.fish, light: colors.fishL, bg: colors.fishBg, bd: colors.fishBd };
    case "casual":
      return { main: colors.casual, light: colors.casualL, bg: colors.casualBg, bd: colors.casualBd };
    default:
      return { main: colors.acc, light: colors.accL, bg: colors.accBg, bd: colors.accBd };
  }
}
