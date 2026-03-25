// ─── 遊戲模式 (Tab) ───
export const GAME_MODES = [
  { id: "slot", label: "老虎機", icon: "🎰", color: "#4a6cf7" },
  { id: "fishing", label: "魚機", icon: "🐟", color: "#06b6d4" },
  { id: "casual", label: "休閒遊戲", icon: "🎮", color: "#a855f7" },
];

// ─── 老虎機 ───
export const SLOT_GAME_TYPES = [
  { id: "classic", label: "經典 Slot", icon: "🎰", desc: "3×3 或 3×5 固定軸數、固定賠付線，傳統水果機/BAR/7 符號風格" },
  { id: "video", label: "視頻 Slot", icon: "🎬", desc: "5 軸以上、多賠付線（20~50 線），含動態動畫、故事劇情與多層 Bonus 結構" },
  { id: "megaways", label: "Megaways", icon: "🔀", desc: "每軸符號數 2~7 隨機變動，可產生最高 117,649 種賠付方式" },
  { id: "jackpot", label: "累積獎金型", icon: "💎", desc: "含多層累積獎池（MINI/MINOR/MAJOR/GRAND），每注提撥固定比例進獎池" },
  { id: "cluster", label: "Cluster Pays", icon: "🧩", desc: "無賠付線，5 個以上相鄰相同符號成群即中獎，搭配消除補落機制" },
  { id: "cascade", label: "連鎖消除型", icon: "⛓", desc: "Tumble/Avalanche 機制，中獎符號消除後上方補入新符號可連鎖中獎" },
  { id: "other", label: "其他類型", icon: "📦", desc: "不屬於上述分類的特殊玩法（如 Hold & Spin、Infinity Reels 等）" },
];

export const SLOT_FEATURES = [
  { id: "wild", label: "Wild 百搭", icon: "🃏", desc: "替代除 Scatter 外所有符號，部分 Wild 帶乘數（×2/×3）或擴展整軸效果" },
  { id: "scatter", label: "Scatter", icon: "⭐", desc: "不受賠付線限制，盤面任意位置出現 3 個以上即觸發 Free Game 或 Bonus" },
  { id: "freespin", label: "Free Game", icon: "🎡", desc: "Scatter 觸發後獲得免費旋轉局數（如 10/15/20 局），期間乘倍提升或特殊規則生效" },
  { id: "bonus", label: "Bonus 獎勵關卡", icon: "🎁", desc: "進入獨立畫面的互動小遊戲，如選擇寶箱、轉輪盤、翻牌比大小等" },
  { id: "multiplier", label: "Multiplier 乘數", icon: "✖️", desc: "獎金乘以指定倍數（×2~×100+），可在基礎遊戲、Free Game 或連鎖消除中累加" },
  { id: "cascade", label: "Tumble 連鎖消除", icon: "💥", desc: "中獎符號消除→新符號從上方落下→可能再次中獎→連續觸發直到無中獎" },
  { id: "buyin", label: "Buy Feature 購買免遊", icon: "🛒", desc: "花費固定倍數 BET（如 ×80/×100）直接進入 Free Game，跳過 Scatter 觸發流程" },
  { id: "jackpot", label: "Jackpot 累積獎金", icon: "👑", desc: "從每注提撥到獎池，分 MINI/MINOR/MAJOR/GRAND 四層，觸發方式依遊戲設計不同" },
  { id: "autoplay", label: "AutoPlay 自動旋轉", icon: "🔄", desc: "設定局數後自動 Spin，通常有停損/停利/觸發 Free Game 停止等進階設定" },
  { id: "respin", label: "Respin 再旋轉", icon: "🔁", desc: "特定條件觸發免費再轉一次，固定已中獎軸、僅重轉未中獎的軸" },
  { id: "expand", label: "Expanding 擴展符號", icon: "↕️", desc: "特殊符號展開覆蓋整軸（1×3/1×4），增加中獎線組合機率" },
  { id: "gamble", label: "Gamble 賭倍", icon: "🎲", desc: "中獎後可選猜紅黑（×2）或猜花色（×4），猜對倍增獎金、猜錯歸零" },
  { id: "sticky", label: "Sticky 黏性符號", icon: "📌", desc: "特定符號在接下來數局內固定不動，持續參與每次 Spin 的中獎判定" },
  { id: "split", label: "Split 符號分裂", icon: "✂️", desc: "一個符號分裂成 2~4 個相同符號，增加盤面符號密度提高中獎率" },
];

// ─── 魚機 ───
export const FISHING_GAME_TYPES = [
  { id: "classic_fish", label: "經典捕魚", icon: "🐠", desc: "傳統 2D 捕魚，選擇砲台倍率（×1~×100）射擊各種魚種，擊殺獲得倍率獎金" },
  { id: "3d_fish", label: "3D 捕魚", icon: "🦈", desc: "3D 場景與粒子特效，魚種有 Z 軸深度移動，增強視覺衝擊與射擊判定複雜度" },
  { id: "boss_fish", label: "Boss 戰型", icon: "🐙", desc: "定時出現高血量 Boss（如巨型章魚/鯊魚），需多人集火或大量子彈，擊殺獲 ×500+ 獎金" },
  { id: "pvp_fish", label: "多人對戰型", icon: "⚔️", desc: "2~4 人即時同場，搶殺同一批魚種、競爭積分排名，含搶 Boss 機制" },
  { id: "season_fish", label: "主題/季節限定", icon: "🌊", desc: "依節日更換場景、魚種、BOSS 造型的限時活動（如春節金龍、萬聖南瓜魚）" },
  { id: "other_fish", label: "其他類型", icon: "📦", desc: "不屬於上述分類的創新玩法（如水族箱養成型、劇情闖關型）" },
];

export const FISHING_FEATURES = [
  { id: "weapon", label: "砲台切換系統", icon: "🔫", desc: "1~10 級砲台，每級消耗 BET 不同（如 ×1/×5/×10/×50），切換時需做金額檢查與射速調整" },
  { id: "boss", label: "Boss 出現機制", icon: "👹", desc: "每 2~5 分鐘定時生成高血量 Boss，血條 UI 同步、擊殺獎金分配邏輯、多人搶殺判定" },
  { id: "special_fish", label: "特殊魚種效果", icon: "🐡", desc: "炸彈魚（範圍 AOE 擊殺）、電鰻（連鎖閃電）、金鯊（×1000 超高倍率）、冰凍魚（全場減速）" },
  { id: "chain_cannon", label: "連線炮台", icon: "⛓️", desc: "多砲台聯合射擊同一目標，傷害疊加計算需確保同步性與正確的獎金分配" },
  { id: "auto_shoot", label: "自動射擊", icon: "🤖", desc: "鎖定後自動追蹤射擊，需驗證：耗彈速率控制、餘額不足停射、切換目標邏輯" },
  { id: "lucky_wheel", label: "幸運轉盤/寶箱", icon: "🎯", desc: "捕魚過程中隨機觸發獎勵轉盤或寶箱，可獲得 ×倍數加成 或特殊道具" },
  { id: "lock_target", label: "鎖定追蹤功能", icon: "🔒", desc: "鎖定指定魚種後砲台自動追蹤，直到該魚被擊殺或游出畫面" },
  { id: "seat_system", label: "座位/房間系統", icon: "💺", desc: "2~4 人同場座位管理，含入座/離座動畫、射擊角度限制、斷線保留座位機制" },
  { id: "skill_system", label: "技能釋放系統", icon: "⚡", desc: "冰凍（全場停止 3 秒）、閃電（隨機擊殺 5 隻）、狂暴（射速 ×3），各有 CD 冷卻時間" },
  { id: "collect", label: "收集/成就任務", icon: "📋", desc: "擊殺指定魚種 ×N 隻完成收集進度，達標獲得額外金幣/道具獎勵" },
];

// ─── 休閒遊戲 ───
export const CASUAL_GAME_TYPES = [
  { id: "match", label: "消除類", icon: "💎", desc: "三消/多消玩法（如 Candy Crush 類），符號匹配消除並計算連擊 Combo 得分" },
  { id: "card", label: "卡牌類", icon: "🃏", desc: "德州撲克、二十一點（Blackjack）、百家樂（Baccarat）等真人或 RNG 發牌類遊戲" },
  { id: "dice", label: "骰子類", icon: "🎲", desc: "擲骰比點（如骰寶/Sic Bo），押大小、押單雙、押指定點數組合" },
  { id: "roulette", label: "輪盤類", icon: "🎡", desc: "歐式（37 格）/美式（38 格）輪盤，押紅黑、單雙、直注、角注等多種投注方式" },
  { id: "scratch", label: "刮刮樂", icon: "🎫", desc: "刮開覆蓋層顯示中獎圖案/金額，即開即兌的玩法，需驗證刮除動畫與結果一致" },
  { id: "hilo", label: "猜大小 (Hi-Lo)", icon: "⬆️", desc: "猜下一張牌比目前大或小，連續猜對可累加倍率，猜錯全部歸零" },
  { id: "crash", label: "Crash 火箭", icon: "🚀", desc: "倍率從 ×1.00 持續上升，玩家須在墜毀（Crash）前按兌現，×倍率 = 獲利倍數" },
  { id: "mine", label: "Mines 掃雷", icon: "💣", desc: "5×5 格子中隱藏地雷，每翻開一格安全格倍率提升，踩中地雷則全部歸零" },
  { id: "other_casual", label: "其他類型", icon: "📦", desc: "不屬於上述的特殊休閒玩法（如賓果 Bingo、基諾 Keno、虛擬賽馬等）" },
];

export const CASUAL_FEATURES = [
  { id: "leaderboard", label: "排行榜系統", icon: "🏆", desc: "即時排名（每日/每週/總榜），按獎金/積分/連勝次數排序，需注意同分排名規則" },
  { id: "daily_task", label: "每日任務", icon: "📅", desc: "每天 00:00 重置的任務清單（如下注滿 1000 / 贏得 5 局），完成獲得金幣或道具" },
  { id: "achievement", label: "成就系統", icon: "🏅", desc: "累積觸發的里程碑（如首勝、連勝 10 場、總下注破百萬），解鎖獎勵或稱號" },
  { id: "countdown", label: "倒數計時機制", icon: "⏱️", desc: "限時操作（如 30 秒內下注），超時自動 Pass/結算，需驗證計時器與伺服器同步" },
  { id: "random_event", label: "隨機事件觸發", icon: "🎲", desc: "遊戲中隨機出現的加倍、免費局、特殊效果（如全場 ×2 獎金持續 3 局）" },
  { id: "item_system", label: "道具/商店系統", icon: "🧰", desc: "可購買或透過任務獲得的道具（如提示卡、重來機會、護盾），需驗證購買扣款與使用效果" },
  { id: "multi_round", label: "多回合對局制", icon: "🔄", desc: "一場遊戲包含多回合（如三戰兩勝），每回合獨立結算但影響最終獎勵乘數" },
  { id: "side_bet", label: "Side Bet 附注", icon: "➕", desc: "主遊戲外的額外下注（如百家樂的莊對/閒對、21 點的保險），獨立賠率獨立結算" },
  { id: "autoplay", label: "Auto 自動玩", icon: "▶️", desc: "設定自動局數（10/25/50/100 局），含停損（輸 X 元停）/停利（贏 X 元停）進階設定" },
  { id: "history", label: "歷史/路紙記錄", icon: "📜", desc: "顯示近 N 局開獎結果（如百家樂路紙、輪盤熱號），需驗證資料正確性與即時更新" },
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
