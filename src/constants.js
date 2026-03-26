// ─── 遊戲模式 (Tab) ───
export const GAME_MODES = [
  { id: "slot", label: "老虎機", icon: "🎰", color: "#4a6cf7" },
  { id: "fishing", label: "魚機", icon: "🐟", color: "#06b6d4" },
  { id: "casual", label: "休閒遊戲", icon: "🎮", color: "#a855f7" },
];

// ─── 快速範本 ───
export const QUICK_TEMPLATES = {
  slot: [
    { id: "standard", label: "標準視頻 Slot", icon: "🎰",
      gameType: "video", features: ["wild","scatter","freespin","autoplay"],
      desc: "包含功能：Wild 百搭、Scatter、Free Game、AutoPlay\n測試重點：中獎判定、免遊觸發/再觸發、自動玩停止條件",
      featureCount: 4 },
    { id: "megaways", label: "Megaways 消除型", icon: "🔀",
      gameType: "megaways", features: ["wild","cascade","multiplier","buyin"],
      desc: "包含功能：Wild、Tumble 連鎖消除、Multiplier 乘數、Buy Feature\n測試重點：變動軸數賠付計算、連鎖消除結算順序、購買免遊防呆",
      featureCount: 4 },
    { id: "jackpot_tpl", label: "累積 Jackpot 型", icon: "💎",
      gameType: "jackpot", features: ["wild","scatter","freespin","jackpot"],
      desc: "包含功能：Wild、Scatter、Free Game、多層 Jackpot\n測試重點：Jackpot 觸發門檻、獎池累積正確性、最低押注資格",
      featureCount: 4 },
    { id: "cluster_tpl", label: "Cluster 集群消除", icon: "🧩",
      gameType: "cluster", features: ["wild","cascade","multiplier","sticky"],
      desc: "包含功能：Wild、連鎖消除、Multiplier、Sticky 黏性符號\n測試重點：群組判定邏輯、黏性符號持續局數、消除補落同步",
      featureCount: 4 },
  ],
  fishing: [
    { id: "classic_mp", label: "經典多人捕魚", icon: "🐠",
      gameType: "classic_fish", features: ["weapon","boss","auto_shoot","seat_system"],
      desc: "包含功能：砲台切換、Boss 機制、自動射擊、座位系統\n測試重點：多人搶殺判定、砲台消耗正確性、座位斷線保留",
      featureCount: 4 },
    { id: "boss_focus", label: "Boss 戰核心型", icon: "🐙",
      gameType: "boss_fish", features: ["weapon","boss","special_fish","skill_system","lock_target"],
      desc: "包含功能：砲台、Boss、特殊魚種、技能系統、鎖定追蹤\n測試重點：Boss 血量同步、技能 CD 冷卻、鎖定追蹤精度",
      featureCount: 5 },
    { id: "pvp_fish_tpl", label: "PVP 即時對戰", icon: "⚔️",
      gameType: "pvp_fish", features: ["weapon","seat_system","skill_system","collect"],
      desc: "包含功能：砲台、座位系統、技能系統、收集任務\n測試重點：即時對戰積分、搶殺獎金歸屬、勝負判定公平性",
      featureCount: 4 },
  ],
  casual: [
    { id: "card_game", label: "卡牌博弈遊戲", icon: "🃏",
      gameType: "card", features: ["side_bet","history","autoplay"],
      desc: "包含功能：Side Bet 附注、歷史路紙、Auto 自動\n測試重點：發牌公平性、附注獨立結算、路紙即時更新",
      featureCount: 3 },
    { id: "crash_game", label: "Crash 火箭倍率", icon: "🚀",
      gameType: "crash", features: ["countdown","autoplay","leaderboard"],
      desc: "包含功能：倒數計時、Auto 自動、排行榜\n測試重點：兌現精準度（×2.50 vs ×2.49）、墜毀時機公平性",
      featureCount: 3 },
    { id: "hilo_game", label: "Hi-Lo 猜大小", icon: "⬆️",
      gameType: "hilo", features: ["history","autoplay","random_event"],
      desc: "包含功能：歷史記錄、Auto 自動、隨機事件\n測試重點：連猜倍率累加正確、猜錯歸零結算、牌堆洗牌公平",
      featureCount: 3 },
    { id: "mine_game", label: "Mines 掃雷翻格", icon: "💣",
      gameType: "mine", features: ["autoplay","leaderboard","achievement"],
      desc: "包含功能：Auto 自動、排行榜、成就系統\n測試重點：地雷分布公平性、翻格倍率計算正確、兌現時機",
      featureCount: 3 },
  ],
};

// ─── 老虎機 ───
export const SLOT_GAME_TYPES = [
  { id: "classic", label: "經典 Slot", icon: "🎰", desc: "3×3 或 3×5 固定軸數、固定賠付線" },
  { id: "video", label: "視頻 Slot", icon: "🎬", desc: "5 軸以上、多賠付線，含動畫與多層 Bonus" },
  { id: "megaways", label: "Megaways", icon: "🔀", desc: "每軸符號數隨機變動，最高 117,649 種賠付" },
  { id: "jackpot", label: "累積獎金型", icon: "💎", desc: "含多層累積獎池（MINI/MINOR/MAJOR/GRAND）" },
  { id: "cluster", label: "Cluster Pays", icon: "🧩", desc: "相鄰相同符號成群即中獎，搭配消除補落" },
  { id: "cascade", label: "連鎖消除型", icon: "⛓", desc: "中獎符號消除後補入新符號可連鎖中獎" },
  { id: "other", label: "其他類型", icon: "📦", desc: "Hold & Spin、Infinity Reels 等特殊玩法" },
];

export const SLOT_FEATURES = [
  { id: "wild", label: "Wild 百搭", icon: "🃏", desc: "替代除 Scatter 外所有符號" },
  { id: "scatter", label: "Scatter", icon: "⭐", desc: "任意位置出現 3+ 觸發 Free Game" },
  { id: "freespin", label: "Free Game", icon: "🎡", desc: "免費旋轉局數，乘倍可能提升" },
  { id: "bonus", label: "Bonus 獎勵", icon: "🎁", desc: "獨立互動小遊戲（選寶箱等）" },
  { id: "multiplier", label: "Multiplier", icon: "✖️", desc: "獎金乘數（×2~×100+）" },
  { id: "cascade", label: "Tumble 連鎖", icon: "💥", desc: "中獎消除→補落→可能再中獎" },
  { id: "buyin", label: "Buy Feature", icon: "🛒", desc: "花費固定倍數 BET 直接進 Free Game" },
  { id: "jackpot", label: "Jackpot", icon: "👑", desc: "多層累積獎金池" },
  { id: "autoplay", label: "AutoPlay", icon: "🔄", desc: "自動旋轉，含停損/停利設定" },
  { id: "respin", label: "Respin", icon: "🔁", desc: "特定條件觸發免費再轉一次" },
  { id: "expand", label: "Expanding", icon: "↕️", desc: "符號展開覆蓋整軸" },
  { id: "gamble", label: "Gamble 賭倍", icon: "🎲", desc: "中獎後猜紅黑倍增獎金" },
  { id: "sticky", label: "Sticky 黏性", icon: "📌", desc: "符號固定數局持續參與判定" },
  { id: "split", label: "Split 分裂", icon: "✂️", desc: "符號分裂增加盤面密度" },
];

// ─── 魚機 ───
export const FISHING_GAME_TYPES = [
  { id: "classic_fish", label: "經典捕魚", icon: "🐠", desc: "2D 捕魚，選砲台倍率射擊各種魚種" },
  { id: "3d_fish", label: "3D 捕魚", icon: "🦈", desc: "3D 場景與粒子特效，含 Z 軸深度" },
  { id: "boss_fish", label: "Boss 戰型", icon: "🐙", desc: "定時高血量 Boss，需集火擊殺" },
  { id: "pvp_fish", label: "多人對戰型", icon: "⚔️", desc: "2~4 人即時同場搶殺競爭排名" },
  { id: "season_fish", label: "主題限定", icon: "🌊", desc: "依節日更換場景的限時活動" },
  { id: "other_fish", label: "其他類型", icon: "📦", desc: "水族箱養成、劇情闖關等創新玩法" },
];

export const FISHING_FEATURES = [
  { id: "weapon", label: "砲台切換", icon: "🔫", desc: "多級砲台切換，消耗倍率不同" },
  { id: "boss", label: "Boss 機制", icon: "👹", desc: "定時生成高血量 Boss" },
  { id: "special_fish", label: "特殊魚種", icon: "🐡", desc: "炸彈魚、電鰻、金鯊等特殊效果" },
  { id: "chain_cannon", label: "連線炮台", icon: "⛓️", desc: "多砲台聯合射擊傷害疊加" },
  { id: "auto_shoot", label: "自動射擊", icon: "🤖", desc: "鎖定後自動追蹤射擊" },
  { id: "lucky_wheel", label: "幸運轉盤", icon: "🎯", desc: "隨機觸發獎勵轉盤或寶箱" },
  { id: "lock_target", label: "鎖定追蹤", icon: "🔒", desc: "鎖定指定魚種自動追蹤" },
  { id: "seat_system", label: "座位系統", icon: "💺", desc: "多人同場座位管理" },
  { id: "skill_system", label: "技能系統", icon: "⚡", desc: "冰凍、閃電、狂暴等主動技能" },
  { id: "collect", label: "收集任務", icon: "📋", desc: "擊殺指定魚種完成收集進度" },
];

// ─── 休閒遊戲 ───
export const CASUAL_GAME_TYPES = [
  { id: "match", label: "消除類", icon: "💎", desc: "三消/多消玩法，Combo 得分" },
  { id: "card", label: "卡牌類", icon: "🃏", desc: "德撲、21 點、百家樂等" },
  { id: "dice", label: "骰子類", icon: "🎲", desc: "骰寶，押大小/單雙/點數" },
  { id: "roulette", label: "輪盤類", icon: "🎡", desc: "歐式/美式輪盤多種投注" },
  { id: "scratch", label: "刮刮樂", icon: "🎫", desc: "刮開覆蓋層顯示中獎結果" },
  { id: "hilo", label: "猜大小", icon: "⬆️", desc: "猜下一張牌的大小，連猜累加" },
  { id: "crash", label: "Crash 火箭", icon: "🚀", desc: "倍率上升，墜毀前兌現獲利" },
  { id: "mine", label: "Mines 掃雷", icon: "💣", desc: "翻格避雷，安全格提升倍率" },
  { id: "other_casual", label: "其他類型", icon: "📦", desc: "賓果、基諾、虛擬賽馬等" },
];

export const CASUAL_FEATURES = [
  { id: "leaderboard", label: "排行榜", icon: "🏆", desc: "即時排名（每日/每週/總榜）" },
  { id: "daily_task", label: "每日任務", icon: "📅", desc: "每日重置的任務清單與獎勵" },
  { id: "achievement", label: "成就系統", icon: "🏅", desc: "累積里程碑解鎖獎勵" },
  { id: "countdown", label: "倒數計時", icon: "⏱️", desc: "限時操作，超時自動結算" },
  { id: "random_event", label: "隨機事件", icon: "🎲", desc: "隨機出現加倍或特殊效果" },
  { id: "item_system", label: "道具商店", icon: "🧰", desc: "購買或獲得的道具系統" },
  { id: "multi_round", label: "多回合制", icon: "🔄", desc: "一場遊戲包含多回合" },
  { id: "side_bet", label: "Side Bet", icon: "➕", desc: "主遊戲外的額外下注" },
  { id: "autoplay", label: "Auto 自動", icon: "▶️", desc: "設定局數自動玩" },
  { id: "history", label: "歷史記錄", icon: "📜", desc: "近 N 局開獎結果/路紙" },
];

// ─── 通用 ───
export const PLATFORMS = [
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "win", label: "Win32" },
  { id: "mac", label: "macOS" },
  { id: "web", label: "Web" },
];

// Helper: Get types/features based on mode
export function getGameTypes(mode) {
  switch (mode) {
    case "fishing": return FISHING_GAME_TYPES;
    case "casual": return CASUAL_GAME_TYPES;
    default: return SLOT_GAME_TYPES;
  }
}

export function getFeatures(mode) {
  switch (mode) {
    case "fishing": return FISHING_FEATURES;
    case "casual": return CASUAL_FEATURES;
    default: return SLOT_FEATURES;
  }
}
