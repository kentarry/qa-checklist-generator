/**
 * Available Gemini models for the user to choose from.
 * Updated 2025/03: Using current Gemini 2.5 generation models.
 * Old models (2.0-flash, 1.5-flash, 1.5-pro) are deprecated.
 */
export const GEMINI_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "速度與品質兼顧，免費額度每日 250 次（推薦）", tier: "免費" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", desc: "最快速度、最低延遲，免費額度最高（每日 1000 次）", tier: "免費" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", desc: "最高品質深度分析，免費額度每日 100 次", tier: "免費（額度較少）" },
];

/**
 * Parse quota/billing error into friendly Chinese message.
 */
function parseFriendlyError(status, errObj) {
  const msg = errObj?.error?.message || "";

  // Quota exceeded
  if (msg.includes("quota") || msg.includes("Quota") || status === 429) {
    const retryMatch = msg.match(/retry in ([\d.]+)s/i);
    const retryInfo = retryMatch ? `\n建議等待 ${Math.ceil(parseFloat(retryMatch[1]))} 秒後重試。` : "";
    return `⚠️ API 額度已用完！\n\n可能原因：\n• 免費方案的每分鐘/每日請求次數已達上限\n• 帳號尚未開啟付費方案\n\n建議解決方式：\n• 切換為其他模型（如 Gemini 1.5 Flash 額度較寬裕）\n• 稍後再試${retryInfo}\n• 至 aistudio.google.com 查看用量或升級方案`;
  }

  // Invalid API key
  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || status === 400) {
    return "❌ API Key 無效，請確認是否正確複製，或至 aistudio.google.com 重新產生。";
  }

  // Permission denied
  if (status === 403) {
    return "🔒 權限不足。此 API Key 可能未啟用 Generative Language API，請至 Google Cloud Console 確認。";
  }

  // Model not found
  if (status === 404 || msg.includes("not found")) {
    return "🔍 所選模型不可用。請切換為其他模型後重試。";
  }

  return msg || `Gemini API 錯誤 (${status})`;
}

/**
 * Call Gemini API to generate QA checklist items.
 * @param {string} apiKey - Gemini API key
 * @param {string} prompt - Full prompt text
 * @param {string} model - Gemini model ID
 * @returns {Promise<Array>} - Array of sections with items
 */
export async function callGemini(apiKey, prompt, model = "gemini-2.5-flash") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 12000 },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(parseFriendlyError(resp.status, err));
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse JSON from response
  let sections;
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    sections = JSON.parse(cleaned);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      sections = JSON.parse(match[0]);
    } else {
      throw new Error("AI 回應格式解析失敗，請重試");
    }
  }

  if (!Array.isArray(sections) || sections.length === 0) {
    throw new Error("AI 未回傳有效項目");
  }

  return sections;
}

// ─── 老虎機 Prompt ───
function buildSlotPrompt({ gameName, platform, gameType, paylines, features, jackpotLayers, platforms, devReq, extraItems, existingItems }) {
  return `你是一位頂尖的 Slot 遊戲品檢測試專家（Senior QA Engineer），擁有超過 8 年老虎機/Slot 遊戲的測試經驗。

你擅長找出「大多數 QA 會遺漏」的盲區，特別是：
- 多種中獎同時觸發時的演出順序、金額加總與動畫同步
- 免費遊戲中再觸發（Retrigger）的局數累加、乘倍疊加邏輯
- Wild 堆疊/擴展時與其他 Wild 或 Scatter 的優先權衝突
- 快速 Spin / 長按 Spin 時動畫跳過是否影響金額結算
- AutoPlay 長時間掛機的記憶體洩漏與效能衰退
- 購買免遊（Buy Feature）後立刻改押注的防呆機制
- Jackpot 的觸發資格（最小押注門檻）的邊界驗證
- 極端押注（最低/最高BET）下的賠率與派彩是否正確
- 斷線恢復後的遊戲狀態還原（特別是在免遊/Bonus中斷線）
- 不同解析度/方向切換時的 UI 元素遮蓋或截斷
- 賠率表(Paytable)數值與實際派彩金額是否一致
- 連續高額中獎後的防作弊後端限制是否影響正常玩家
- Bet 面板快速切換後是否正確鎖定新的注額

根據以下遊戲資訊，產出「一般 QA 檢驗表不會列出、但實際測試中容易出問題」的補充檢驗項目。

【核心規則】
1. 每個檢驗項目必須是具體、可執行的測試步驟，描述要包含「操作→預期結果」
2. 聚焦在「邊界值」「異常流程」「競態條件」「跨平台差異」「斷線恢復」「金流安全」等高風險場景
3. 不要列出基本功能驗證（如"確認遊戲能啟動"），要列出「容易被忽略但出問題會很嚴重」的項目
4. 按分類組織，每個分類 5-8 個項目
5. 回覆格式必須是純 JSON 陣列，不要加 markdown 符號或其他文字
6. ${existingItems.length > 0 ? `以下是既有檢驗單的 ${existingItems.length} 個項目，你的項目不可與這些重複或語意相近，要找出它們沒有覆蓋到的盲區` : "這是全新的檢驗表，請完整涵蓋所有可能的盲區"}

【遊戲資訊】
遊戲：${gameName || "未提供"}
平台：${platform || "未提供"}
類型：${gameType || "未提供"}
${paylines ? `賠付線：${paylines}` : ""}
功能：${features.length > 0 ? features.join("、") : "未勾選"}
${jackpotLayers ? `Jackpot 層級：${jackpotLayers}` : ""}
支援平台：${platforms.join("、")}
${devReq ? `\n研發/主辦需求：\n${devReq}` : ""}
${extraItems ? `\n額外指定：\n${extraItems}` : ""}
${existingItems.length > 0 ? `\n【既有項目（不可重複）】\n${existingItems.slice(0, 120).join("\n")}` : ""}

請產出 8-12 個分類，必須包含但不限於：
- 斷線異常與狀態恢復（各階段斷線點的恢復正確性）
- 金流邊界與安全（極端押注、餘額不足邊界、派彩正確性）
- 特殊功能交互衝突（多功能同時觸發、嵌套觸發）
- 符號與盤面邏輯（中獎判定順序、符號替代優先權）
- 自動玩進階場景（長時間運行、條件停止）
- 跨平台差異（不同裝置/瀏覽器的行為差異）
- 效能與壓力（長時間遊戲、快速操作）
- 介面與動畫同步（快轉/慢轉/跳過動畫的結算同步）

回覆格式（純 JSON，不要 markdown）：
[{"title":"分類名稱","items":[{"text":"具體操作步驟 → 預期結果","note":"這項的品檢意義或常見踩坑場景"}]}]`;
}

// ─── 魚機 Prompt ───
function buildFishingPrompt({ gameName, platform, gameType, features, platforms, devReq, extraItems, existingItems }) {
  return `你是一位頂尖的捕魚機遊戲品檢測試專家（Senior QA Engineer），擁有豐富的魚機測試經驗。

你擅長找出「大多數 QA 會遺漏」的盲區，特別是：
- 多人同時攻擊同一魚的擊殺判定與獎金歸屬（誰射最後一擊？）
- 武器切換瞬間是否有「射出上一等級砲彈但扣下一等級幣量」的 bug
- Boss 血量顯示與實際後端扣血的同步延遲
- 座位切換或離開時砲彈已發射但尚未命中的結算歸屬
- 自動射擊開啟後的消耗速率失控（連續對空射擊）
- 場景切換過渡期間的操作防呆（魚群離開中是否還能射擊）
- 鎖定功能追蹤移動中的魚的射擊角度精確度
- 技能效果（冰凍/閃電）影響範圍的邊界判定
- 同場多人技能互相影響時的優先順序
- 極端情況下（全畫面佈滿魚）的效能表現
- 砲台升級後的威力數值是否與說明一致
- 斷線重連後砲台等級、鎖定狀態、餘額是否正確還原

根據以下魚機資訊，產出「一般 QA 檢驗表不會列出、但實際測試中容易出問題」的補充檢驗項目。

【核心規則】
1. 每個檢驗項目必須是具體、可執行的測試步驟，描述要包含「操作→預期結果」
2. 聚焦在「多人競爭」「即時射擊判定」「砲台切換」「Boss戰」「斷線恢復」「金流安全」等高風險場景
3. 不要列出基本功能驗證，要列出「容易被忽略但出問題會很嚴重」的項目
4. 每個分類 5-8 個項目
5. 回覆格式必須是純 JSON 陣列
6. ${existingItems.length > 0 ? `以下是既有檢驗單的 ${existingItems.length} 個項目，你的項目不可與這些重複，要找出它們沒有覆蓋到的盲區` : "這是全新的檢驗表，請完整涵蓋所有可能的盲區"}

【遊戲資訊】
遊戲：${gameName || "未提供"}
平台：${platform || "未提供"}
類型：${gameType || "未提供"}
功能：${features.length > 0 ? features.join("、") : "未勾選"}
支援平台：${platforms.join("、")}
${devReq ? `\n研發/主辦需求：\n${devReq}` : ""}
${extraItems ? `\n額外指定：\n${extraItems}` : ""}
${existingItems.length > 0 ? `\n【既有項目（不可重複）】\n${existingItems.slice(0, 120).join("\n")}` : ""}

請產出 8-12 個分類，必須包含但不限於：
- 射擊判定與命中（砲彈軌跡、命中判定、多人搶殺）
- 武器系統邊界（切換、升降級、耗彈率）
- Boss 戰機制（血量、出現時機、獎金分配）
- 多人同場互動（座位系統、獎金歸屬、可見性）
- 特殊魚種效果（連鎖、範圍、倍率計算）
- 斷線與狀態恢復（各場景的斷線還原）
- 金流安全（押注消耗、獎金派發、餘額同步）
- 效能壓力（大量物件、特效堆疊）
- 技能系統（冷卻、範圍、效果堆疊）
- 場景切換（過渡動畫、資料保持）

回覆格式（純 JSON，不要 markdown）：
[{"title":"分類名稱","items":[{"text":"具體操作步驟 → 預期結果","note":"這項的品檢意義或常見踩坑場景"}]}]`;
}

// ─── 休閒遊戲 Prompt ───
function buildCasualPrompt({ gameName, platform, gameType, features, platforms, devReq, extraItems, existingItems }) {
  return `你是一位頂尖的休閒博弈遊戲品檢測試專家（Senior QA Engineer），擁有豐富的休閒遊戲測試經驗。

你擅長找出「大多數 QA 會遺漏」的盲區，特別是：
- 倒數計時歸零瞬間完成操作的邊界（是否算分？是否扣款？）
- 隨機事件/RNG 的公平性驗證（是否有可預測的 pattern）
- 排行榜即時更新的延遲與同分排序邏輯（同分誰排前面？）
- 快速重複操作（連點下注）的防呆與金額正確性
- 多回合制遊戲中途離開的結算規則
- 附注(Side Bet)與主注的結算順序與顯示
- Crash 類遊戲的自動兌現精確度（設定 2.5x 是否出 2.49x）
- 掃雷類遊戲的地雷分布公平性驗證
- 卡牌遊戲的洗牌公平性與歷史記錄追溯
- 遊戲動畫播放期間的操作鎖定是否完整
- 購買道具後的效果持續時間計算精確度
- 斷線重連後的遊戲狀態還原（特別是倒數中/多回合中）

根據以下遊戲資訊，產出「一般 QA 檢驗表不會列出、但實際測試中容易出問題」的補充檢驗項目。

【核心規則】
1. 每個檢驗項目必須是具體、可執行的測試步驟，描述要包含「操作→預期結果」
2. 聚焦在「時間邊界」「操作防呆」「結算正確」「公平性」「斷線恢復」「金流安全」等高風險場景
3. 不要列出基本功能驗證，要列出「容易被忽略但出問題會很嚴重」的項目
4. 每個分類 5-8 個項目
5. 回覆格式必須是純 JSON 陣列
6. ${existingItems.length > 0 ? `以下是既有檢驗單的 ${existingItems.length} 個項目，你的項目不可與這些重複，要找出它們沒有覆蓋到的盲區` : "這是全新的檢驗表，請完整涵蓋所有可能的盲區"}

【遊戲資訊】
遊戲：${gameName || "未提供"}
平台：${platform || "未提供"}
類型：${gameType || "未提供"}
功能：${features.length > 0 ? features.join("、") : "未勾選"}
支援平台：${platforms.join("、")}
${devReq ? `\n研發/主辦需求：\n${devReq}` : ""}
${extraItems ? `\n額外指定：\n${extraItems}` : ""}
${existingItems.length > 0 ? `\n【既有項目（不可重複）】\n${existingItems.slice(0, 120).join("\n")}` : ""}

請產出 8-12 個分類，必須包含但不限於：
- 操作邊界與防呆（快速/重複/同時操作）  
- 時間與倒數機制（計時精確度、超時處理）
- 結算邏輯正確性（勝負判定、多回合累計）
- 公平性與 RNG（隨機性驗證、結果分布）
- 金流安全（押注/派彩/餘額同步）
- 排行榜與社交（排名更新、同分邏輯、作弊防範）
- 道具與獎勵（購買、使用、持續時間）
- 斷線恢復（各遊戲階段的斷線還原）
- 跨平台差異（裝置、瀏覽器差異）
- 效能與穩定性（長時間遊戲、連續高頻操作）

回覆格式（純 JSON，不要 markdown）：
[{"title":"分類名稱","items":[{"text":"具體操作步驟 → 預期結果","note":"這項的品檢意義或常見踩坑場景"}]}]`;
}

/**
 * Build the prompt based on game mode.
 */
export function buildPrompt({ mode = "slot", gameName, platform, gameType, paylines, features, jackpotLayers, platforms, devReq, extraItems, existingItems }) {
  const base = { gameName, platform, gameType, features, platforms, devReq, extraItems, existingItems: existingItems || [] };

  switch (mode) {
    case "fishing":
      return buildFishingPrompt(base);
    case "casual":
      return buildCasualPrompt(base);
    default:
      return buildSlotPrompt({ ...base, paylines, jackpotLayers });
  }
}
