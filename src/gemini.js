/**
 * Available Gemini models for the user to choose from.
 */
export const GEMINI_MODELS = [
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", desc: "最快速度、最省額度（每日 1000 次免費）", tier: "免費（推薦）" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "速度與品質兼顧（每日 250 次免費）", tier: "免費" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", desc: "最高品質深度分析（每日 100 次免費）", tier: "免費（額度少）" },
];

/**
 * Parse quota/billing error into friendly Chinese message.
 */
function parseFriendlyError(status, errObj) {
  const msg = errObj?.error?.message || "";

  if (msg.includes("quota") || msg.includes("Quota") || status === 429) {
    const retryMatch = msg.match(/retry in ([\d.]+)s/i);
    const retryInfo = retryMatch ? `\n建議等待 ${Math.ceil(parseFloat(retryMatch[1]))} 秒後重試。` : "";
    return `⚠️ API 額度已用完！\n\n建議：\n• 切換為 Flash-Lite 模型（額度最寬裕）\n• 稍後再試${retryInfo}\n• 至 aistudio.google.com 查看用量`;
  }

  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || status === 400) {
    return "❌ API Key 無效，請確認是否正確複製，或至 aistudio.google.com 重新產生。";
  }

  if (status === 403) {
    return "🔒 權限不足。此 API Key 可能未啟用 Generative Language API，請至 Google Cloud Console 確認。";
  }

  if (status === 404 || msg.includes("not found")) {
    return "🔍 所選模型不可用。請切換為其他模型後重試。";
  }

  return msg || `Gemini API 錯誤 (${status})`;
}

/**
 * Call Gemini API to generate QA checklist items.
 * @param {string} apiKey
 * @param {string} prompt
 * @param {string} model
 * @param {Array} images - Optional array of {dataUrl, type} for vision
 */
export async function callGemini(apiKey, prompt, model = "gemini-2.5-flash-lite", images = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Build parts: text + optional images
  const parts = [{ text: prompt }];
  if (images && images.length > 0) {
    images.forEach((img) => {
      if (img.dataUrl && img.type?.startsWith("image/")) {
        const base64 = img.dataUrl.split(",")[1];
        if (base64) {
          parts.push({
            inline_data: {
              mime_type: img.type,
              data: base64,
            },
          });
        }
      }
    });
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.25, maxOutputTokens: 6000 },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(parseFriendlyError(resp.status, err));
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

// ─── Common prompt core ───
function coreRules(existingItems) {
  return `【核心規則】
1. 每個項目必須是「操作步驟 → 預期結果」格式
2. 聚焦高風險場景：邊界值、異常流程、競態條件、斷線恢復、金流安全
3. 不要列基本功能驗證，只列「容易被忽略但出問題嚴重」的項目
4. 每分類 3-6 個項目
5. 回覆格式必須是純 JSON 陣列（不要 markdown）
6. ${existingItems.length > 0 ? `以下有 ${existingItems.length} 個既有項目，不可重複，要找出未覆蓋的盲區` : "全新檢驗表，完整涵蓋盲區"}`;
}

function gameInfoBlock({ gameName, platform, gameType, features, platforms, devReq, extraItems, existingItems, paylines, jackpotLayers }) {
  let info = `【遊戲資訊】
類型：${gameType || "未提供"}
功能：${features.length > 0 ? features.join("、") : "未勾選"}
平台：${platforms.join("、")}`;
  if (paylines) info += `\n賠付線：${paylines}`;
  if (jackpotLayers) info += `\nJackpot 層級：${jackpotLayers}`;
  if (devReq) info += `\n需求說明：\n${devReq}`;
  if (extraItems) info += `\n額外關注：\n${extraItems}`;
  if (existingItems.length > 0) info += `\n【既有項目（不可重複）】\n${existingItems.slice(0, 50).join("\n")}`;
  return info;
}

const JSON_FORMAT = `回覆格式（純 JSON）：
[{"title":"分類名稱","items":[{"text":"操作步驟 → 預期結果","note":"品檢意義"}]}]`;

// ─── Slot Prompt ───
function buildSlotPrompt(params) {
  return `你是資深 Slot 遊戲 QA 專家。根據以下資訊產出補充檢驗項目。

${coreRules(params.existingItems)}

${gameInfoBlock(params)}

請產出 5-8 個分類，涵蓋：斷線恢復、金流邊界、功能交互衝突、符號邏輯、自動玩、跨平台差異、效能壓力、動畫同步。

${JSON_FORMAT}`;
}

// ─── Fishing Prompt ───
function buildFishingPrompt(params) {
  return `你是資深捕魚機 QA 專家。根據以下資訊產出補充檢驗項目。

${coreRules(params.existingItems)}

${gameInfoBlock(params)}

請產出 5-8 個分類，涵蓋：射擊判定、武器系統、Boss 戰、多人互動、特殊魚種、斷線恢復、金流安全、效能壓力。

${JSON_FORMAT}`;
}

// ─── Casual Prompt ───
function buildCasualPrompt(params) {
  return `你是資深休閒博弈 QA 專家。根據以下資訊產出補充檢驗項目。

${coreRules(params.existingItems)}

${gameInfoBlock(params)}

請產出 5-8 個分類，涵蓋：操作防呆、倒數機制、結算邏輯、公平性 RNG、金流安全、排行榜、道具獎勵、斷線恢復。

${JSON_FORMAT}`;
}

/**
 * Build the prompt based on game mode.
 */
export function buildPrompt({ mode = "slot", gameName, platform, gameType, paylines, features, jackpotLayers, platforms, devReq, extraItems, existingItems }) {
  const base = { gameName, platform, gameType, features, platforms, devReq, extraItems, existingItems: existingItems || [], paylines, jackpotLayers };

  switch (mode) {
    case "fishing":
      return buildFishingPrompt(base);
    case "casual":
      return buildCasualPrompt(base);
    default:
      return buildSlotPrompt(base);
  }
}
