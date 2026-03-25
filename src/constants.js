// ─── 遊戲模式 (Tab) ───
export const GAME_MODES = [
  { id: "slot", label: "老虎機", icon: "🎰", color: "#4a6cf7" },
  { id: "fishing", label: "魚機", icon: "🐟", color: "#06b6d4" },
  { id: "casual", label: "休閒遊戲", icon: "🎮", color: "#a855f7" },
];

// ─── 老虎機 ───
export const SLOT_GAME_TYPES = [
  { id: "classic", label: "經典老虎機", icon: "🎰", desc: "3-5 軸，固定賠付線，傳統水果機風格" },
  { id: "video", label: "視頻老虎機", icon: "🎬", desc: "多賠付線、豐富動畫與多層功能玩法" },
  { id: "megaways", label: "Megaways", icon: "🔀", desc: "每軸符號數隨機變動，賠付方式可達數萬種" },
  { id: "jackpot", label: "累積獎金", icon: "💎", desc: "含多層累積獎池（如 MINI/MINOR/MAJOR/GRAND）" },
  { id: "cluster", label: "群組消除", icon: "🧩", desc: "相鄰相同符號成群即中獎（Cluster Pays）" },
  { id: "cascade", label: "連鎖消除", icon: "⛓", desc: "中獎後符號消除並補入新符號（Tumble/Avalanche）" },
  { id: "other", label: "其他", icon: "📦", desc: "不屬於上述分類的特殊玩法" },
];

export const SLOT_FEATURES = [
  { id: "wild", label: "Wild 百搭", icon: "🃏", desc: "百搭符號：可替代其他符號組成中獎組合，某些 Wild 會帶有乘數或擴展效果" },
  { id: "scatter", label: "Scatter 觸發", icon: "⭐", desc: "觸發符號：出現指定數量即觸發特殊功能（如免費遊戲），不受賠付線限制" },
  { id: "freespin", label: "免費遊戲 (Free Spin)", icon: "🎡", desc: "達成條件後獲得免費旋轉局數，通常有較高乘倍或特殊規則" },
  { id: "bonus", label: "Bonus 獎勵關卡", icon: "🎁", desc: "進入另一個畫面或玩法的特殊關卡，如選擇寶箱、轉輪盤等" },
  { id: "multiplier", label: "乘數 (Multiplier)", icon: "✖️", desc: "將獎金乘以指定倍數的機制，可能出現在基礎遊戲或免費遊戲中" },
  { id: "cascade", label: "連鎖消除", icon: "💥", desc: "中獎符號消除後上方符號下落並可能形成新的中獎組合" },
  { id: "buyin", label: "購買免遊 (Buy Feature)", icon: "🛒", desc: "花費固定倍數 BET 直接進入免費遊戲或特殊功能，跳過正常觸發" },
  { id: "jackpot", label: "Jackpot 累積獎金", icon: "👑", desc: "從每注中提撥累積到獎池，分多層派彩（MINI/MINOR/MAJOR/GRAND）" },
  { id: "autoplay", label: "自動玩 (AutoPlay)", icon: "🔄", desc: "設定局數後自動旋轉，通常有停損/停利/觸發免遊停止等進階設定" },
  { id: "respin", label: "Respin 再旋轉", icon: "🔁", desc: "特定條件下免費再轉一次，固定部分軸只轉未固定的軸" },
  { id: "expand", label: "擴展符號 (Expanding)", icon: "↕️", desc: "特殊符號展開覆蓋整軸或整行，增加中獎機會" },
  { id: "gamble", label: "賭倍 (Gamble)", icon: "🎲", desc: "中獎後可選擇猜大小或猜花色，猜對倍增、猜錯歸零" },
  { id: "sticky", label: "黏性符號 (Sticky)", icon: "📌", desc: "特定符號在數局內固定不動，持續參與後續旋轉的中獎判定" },
  { id: "split", label: "符號分裂 (Split)", icon: "✂️", desc: "符號分裂成多個相同符號，增加盤面上的符號數量" },
];

// ─── 魚機 ───
export const FISHING_GAME_TYPES = [
  { id: "classic_fish", label: "經典捕魚", icon: "🐠", desc: "傳統捕魚玩法，選擇砲台倍率射擊各種魚種" },
  { id: "3d_fish", label: "3D 捕魚", icon: "🦈", desc: "3D 場景與特效，增強視覺衝擊與沉浸感" },
  { id: "boss_fish", label: "Boss 戰型", icon: "🐙", desc: "含有大型 Boss 魚出現，擊殺可獲得高倍獎金" },
  { id: "pvp_fish", label: "對戰型", icon: "⚔️", desc: "多人即時對戰，搶奪同場獎金或比拼得分" },
  { id: "season_fish", label: "主題/季節", icon: "🌊", desc: "依節日或主題更換場景與魚種的限時活動型" },
  { id: "other_fish", label: "其他", icon: "📦", desc: "不屬於上述分類的特殊玩法" },
];

export const FISHING_FEATURES = [
  { id: "weapon", label: "武器/砲台系統", icon: "🔫", desc: "不同等級砲台有不同威力與消耗，玩家可自由切換砲台倍率" },
  { id: "boss", label: "Boss 機制", icon: "👹", desc: "定時出現的高血量大魚/Boss，需要多發子彈擊殺，獎金通常較高" },
  { id: "special_fish", label: "特殊魚種", icon: "🐡", desc: "具有特殊效果的魚，如炸彈魚（範圍傷害）、電鰻（連鎖擊殺）、金鯊（超高倍率）" },
  { id: "chain_cannon", label: "連線炮台", icon: "⛓️", desc: "多個砲台聯合射擊的機制，提高擊殺效率" },
  { id: "auto_shoot", label: "自動射擊", icon: "🤖", desc: "啟用後自動對準目標射擊，需注意耗彈速率與停損機制" },
  { id: "lucky_wheel", label: "幸運轉盤", icon: "🎯", desc: "捕魚過程中觸發的額外獎勵轉盤，可獲得加倍或特殊道具" },
  { id: "lock_target", label: "鎖定功能", icon: "🔒", desc: "鎖定特定魚種後砲台自動追蹤射擊，直到目標消滅或離開" },
  { id: "seat_system", label: "座位系統", icon: "💺", desc: "多人同場時的座位管理，影響射擊角度與視野範圍" },
  { id: "skill_system", label: "技能系統", icon: "⚡", desc: "可釋放冰凍、閃電、狂暴等技能，有冷卻時間限制" },
  { id: "collect", label: "收集任務", icon: "📋", desc: "擊殺特定魚種累積收集進度，完成可獲得額外獎勵" },
];

// ─── 休閒遊戲 ───
export const CASUAL_GAME_TYPES = [
  { id: "match", label: "消除類", icon: "💎", desc: "三消或多消玩法，符號匹配消除並計算得分" },
  { id: "card", label: "卡牌類", icon: "🃏", desc: "撲克牌相關玩法，如德州撲克、二十一點、百家樂" },
  { id: "dice", label: "骰子類", icon: "🎲", desc: "擲骰子比點數或特定組合的玩法" },
  { id: "roulette", label: "輪盤類", icon: "🎡", desc: "歐式/美式輪盤或轉盤類玩法" },
  { id: "scratch", label: "刮刮樂", icon: "🎫", desc: "刮開覆蓋層顯示中獎結果的即開型玩法" },
  { id: "hilo", label: "猜大小", icon: "⬆️", desc: "猜測下一張牌或數字大小的簡單博弈玩法" },
  { id: "crash", label: "Crash 火箭", icon: "🚀", desc: "倍率持續上升，玩家須在墜毀前及時兌現的刺激玩法" },
  { id: "mine", label: "掃雷 (Mines)", icon: "💣", desc: "在格子中避開地雷翻開安全格，翻越多倍率越高" },
  { id: "other_casual", label: "其他", icon: "📦", desc: "不屬於上述分類的特殊玩法" },
];

export const CASUAL_FEATURES = [
  { id: "leaderboard", label: "排行榜", icon: "🏆", desc: "即時或定期更新的玩家排名機制，按積分/獎金排序" },
  { id: "daily_task", label: "每日任務", icon: "📅", desc: "每天重置的挑戰任務，完成可獲得額外獎勵" },
  { id: "achievement", label: "成就系統", icon: "🏅", desc: "累積觸發的里程碑獎勵，如連勝、總押注額等" },
  { id: "countdown", label: "倒數計時", icon: "⏱️", desc: "限時操作的機制，超時會自動結算或喪失操作機會" },
  { id: "random_event", label: "隨機事件", icon: "🎲", desc: "遊戲中隨機觸發的加倍、獎勵或特殊效果" },
  { id: "item_system", label: "道具系統", icon: "🧰", desc: "可購買或獲得的輔助道具，如提示、重來、護盾等" },
  { id: "multi_round", label: "多回合制", icon: "🔄", desc: "一次遊戲包含多個回合，每回合結果影響最終獎勵" },
  { id: "side_bet", label: "附注 (Side Bet)", icon: "➕", desc: "主遊戲外的額外下注選項，獨立結算的附加玩法" },
  { id: "autoplay", label: "自動玩", icon: "▶️", desc: "自動進行局數的功能，含設定停損停利條件" },
  { id: "history", label: "歷史記錄", icon: "📜", desc: "顯示過去遊戲結果與下注記錄的功能" },
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
