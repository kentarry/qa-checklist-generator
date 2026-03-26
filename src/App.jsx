import React, { useState, useRef, useCallback } from "react";
import { GAME_MODES, PLATFORMS, getGameTypes, getFeatures, QUICK_TEMPLATES } from "./constants";
import { getModeColors } from "./theme";
import { TextInput, TextArea, Chip, Section, Label, TabBar, TemplateCard, StepIndicator } from "./components";
import { callGemini, buildPrompt, GEMINI_MODELS } from "./gemini";
import { readExcelItems, analyzeExcelStructure, buildAndDownloadExcel } from "./excel";

export default function App() {
  const [mode, setMode] = useState("slot");
  const [gt, setGt] = useState("");
  const [feat, setFeat] = useState(new Set());
  const [plat, setPlat] = useState(new Set(["ios", "android", "win"]));
  const [hasXl, setHasXl] = useState(false);
  const [xlName, setXlName] = useState("");
  const [xlData, setXlData] = useState(null);
  const [xlStructure, setXlStructure] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [resultMsg, setResultMsg] = useState("");
  const [resultFile, setResultFile] = useState("");
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");
  const [activeTemplate, setActiveTemplate] = useState("");

  const payRef = useRef(null);
  const jpRef = useRef(null);
  const devRef = useRef(null);
  const extRef = useRef(null);
  const apiKeyRef = useRef(null);
  const xlInputRef = useRef(null);
  const imgInputRef = useRef(null);

  const mc = getModeColors(mode);

  const tog = useCallback((sf, v) => {
    sf((p) => {
      const n = new Set(p);
      n.has(v) ? n.delete(v) : n.add(v);
      return n;
    });
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setGt("");
    setFeat(new Set());
    setActiveTemplate("");
  }, []);

  const handleTemplateSelect = useCallback((tpl) => {
    if (activeTemplate === tpl.id) {
      setActiveTemplate("");
      setGt("");
      setFeat(new Set());
      return;
    }
    setActiveTemplate(tpl.id);
    setGt(tpl.gameType);
    setFeat(new Set(tpl.features));
  }, [activeTemplate]);

  const handleXlUpload = useCallback((file) => {
    if (!file) return;
    setHasXl(true);
    setXlName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      setXlData(data);
      // Analyze the structure for format matching
      try {
        const structure = analyzeExcelStructure(data);
        setXlStructure(structure);
      } catch (err) {
        console.error("Excel structure analysis failed:", err);
        setXlStructure(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleImgUpload = useCallback((fl) => {
    if (!fl || fl.length === 0) return;
    Array.from(fl).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) =>
          setImgs((p) => [...p, { name: file.name, type: file.type, dataUrl: e.target.result }]);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        setImgs((p) => [...p, { name: file.name, type: file.type, dataUrl: null }]);
      }
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    const apiKey = apiKeyRef.current?.value?.trim();
    if (!apiKey) {
      setError("請輸入 Gemini API Key");
      return;
    }
    setStatus("loading");
    setError("");

    const pay = payRef.current?.value || "";
    const jp = jpRef.current?.value || "";
    const dev = devRef.current?.value || "";
    const extra = extRef.current?.value || "";
    const FEATURES = getFeatures(mode);
    const GAME_TYPES = getGameTypes(mode);
    const featList = [...feat].map((f) => FEATURES.find((x) => x.id === f)?.label || f);
    const platLabels = [...plat].map((p) => PLATFORMS.find((x) => x.id === p)?.label || p);
    const typeLabel = gt ? GAME_TYPES.find((g) => g.id === gt)?.label || gt : "";

    try {
      let existingItems = [];
      if (xlData) {
        try {
          existingItems = readExcelItems(xlData);
        } catch (e) {
          console.error("Excel 讀取:", e);
        }
      }

      const prompt = buildPrompt({
        mode,
        gameName: "",
        platform: "",
        gameType: typeLabel,
        paylines: pay,
        features: featList,
        jackpotLayers: jp,
        platforms: platLabels,
        devReq: dev,
        extraItems: extra,
        existingItems,
      });

      // Pass images to Gemini for visual analysis
      const imageData = imgs.filter((i) => i.dataUrl && i.type?.startsWith("image/"));
      const sections = await callGemini(apiKey, prompt, selectedModel, imageData);

      const modeLabel = GAME_MODES.find((m) => m.id === mode)?.label || "";
      const fn = buildAndDownloadExcel(sections, platLabels, "", modeLabel, xlStructure);
      const total = sections.reduce((s, sec) => s + (sec.items?.length || 0), 0);

      setResultFile(fn);
      setResultMsg(`${sections.length} 個分類、${total} 個項目`);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(e.message || "發生錯誤");
      setStatus("error");
    }
  }, [mode, gt, feat, plat, xlData, xlStructure, imgs, selectedModel]);

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="app-container">
        <div className="status-screen">
          <div className="loading-spinner" style={{ borderTopColor: mc.main }} />
          <div className="status-title">AI 正在分析並產生檢驗表...</div>
          <div className="status-sub-text">
            根據你的{GAME_MODES.find((m) => m.id === mode)?.label || "遊戲"}資訊
            {hasXl ? "與既有檢驗單" : ""}{imgs.length > 0 ? "及遊戲截圖" : ""}，分析高風險盲區
          </div>
          <div className="status-pulse">約 10-20 秒...</div>
        </div>
      </div>
    );
  }

  // ── Done ──
  if (status === "done") {
    return (
      <div className="app-container">
        <div className="status-screen">
          <div className="success-icon">✓</div>
          <div className="status-title">檢驗表已下載</div>
          <div className="status-file" style={{ color: mc.light }}>{resultFile}</div>
          <div className="status-msg">{resultMsg}</div>
          {hasXl && (
            <div className="warning-box">
              產出的是獨立的補充檢驗表，已沿用「{xlName}」的欄位格式並去重。原始檔案未被修改。
            </div>
          )}
          <div className="status-actions">
            <button className="btn-secondary" onClick={() => setStatus("idle")}>
              ← 返回修改
            </button>
            <button
              className={`btn-accent mode-${mode}`}
              style={{ background: mc.main }}
              onClick={handleGenerate}
            >
              再次產生 ↻
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gameTypes = getGameTypes(mode);
  const features = getFeatures(mode);
  const templates = QUICK_TEMPLATES[mode] || [];

  const devPlaceholders = {
    slot: "例：\n1. 盤面 3x5 消除類 SLOT\n2. 3 個 SCATTER 觸發 10 局 Free Game\n3. WILD 可替代除 SCATTER 以外所有符號",
    fishing: "例：\n1. 砲台等級 1-10\n2. Boss 每 3 分鐘出現一次\n3. 特殊魚種：炸彈魚範圍殺傷",
    casual: "例：\n1. 猜大小，52 張牌不含鬼牌\n2. 連續猜對可加倍，最高 5 連\n3. 平手時自動歸還押注",
  };

  const currentStep = gt || feat.size > 0 ? 2 : 1;

  // ── Main Form ──
  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="header-badge">
          <span>⚡</span>
          QA CHECKLIST GENERATOR
        </div>
        <div className="header-title">遊戲測試檢驗表</div>
        <div className="header-sub">選擇遊戲類別 → 設定資訊 → AI 分析盲區 → 下載 Excel</div>
      </div>

      {/* Step Indicator */}
      <StepIndicator current={currentStep} mode={mode} />

      {/* Tab Bar */}
      <TabBar tabs={GAME_MODES} activeId={mode} onChange={handleModeChange} />

      {/* Error */}
      {error && <div className="error-box">{error.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>}

      {/* ─ 1. API Key ─ */}
      <Section color="#fbbf24" title="API Key 設定" sub="前往 aistudio.google.com → Get API Key" defaultOpen={true}>
        <div className="api-key-row">
          <TextInput
            placeholder="貼上 Gemini API Key"
            inputRef={apiKeyRef}
            type={showKey ? "text" : "password"}
          />
          <button className="btn-show-key" onClick={() => setShowKey((p) => !p)}>
            {showKey ? "隱藏" : "顯示"}
          </button>
        </div>
        <div className="model-row">
          <select
            className="form-select form-select-compact"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {GEMINI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}（{m.tier}）
              </option>
            ))}
          </select>
          <div className="model-desc">
            {GEMINI_MODELS.find((m) => m.id === selectedModel)?.desc || ""}
          </div>
        </div>
      </Section>

      {/* ─ 2. Upload Existing Excel (top, clearly optional) ─ */}
      <Section color="#10b981" title="📊 匯入既有檢驗單（選填）" sub="上傳現有 Excel，AI 會避免產出重複項目，並沿用你的欄位格式" defaultOpen={true}>
        {!hasXl ? (
          <div
            className="upload-zone upload-zone-green"
            onClick={() => xlInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer?.files?.[0]; if (f) handleXlUpload(f); }}
          >
            <div className="upload-icon">📊</div>
            <div className="upload-text">
              拖曳或<span className="upload-link upload-link-green">點擊上傳</span> .xlsx 檔案
            </div>
            <div className="upload-hint">上傳後產出的 Excel 會沿用你的表頭欄位格式</div>
            <input
              ref={xlInputRef} type="file" accept=".xlsx,.xls"
              className="hidden-input"
              onChange={(e) => { const f = e.target?.files?.[0]; if (f) handleXlUpload(f); if (e.target) e.target.value = ""; }}
            />
          </div>
        ) : (
          <div className="uploaded-file">
            <div className="uploaded-file-info">
              <span className="uploaded-file-name">✓ {xlName}</span>
              {xlStructure && xlStructure.headers.length > 0 && (
                <span className="uploaded-file-meta">
                  偵測到 {xlStructure.headers.length} 欄：{xlStructure.headers.filter(h => h).slice(0, 4).join("、")}{xlStructure.headers.length > 4 ? "..." : ""}
                </span>
              )}
            </div>
            <button
              className="uploaded-file-remove"
              onClick={() => { setHasXl(false); setXlName(""); setXlData(null); setXlStructure(null); }}
            >移除</button>
          </div>
        )}
      </Section>

      {/* ─ 3. Screenshot / Media Upload ─ */}
      <Section color="#fb923c" title="📷 上傳遊戲截圖（選填）" sub="提供遊戲畫面讓 AI 看到實際介面，產出更精準的檢驗項目" defaultOpen={true}>
        <div
          className="upload-zone"
          onClick={() => imgInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleImgUpload(e.dataTransfer?.files); }}
        >
          <div className="upload-icon">📷</div>
          <div className="upload-text">
            拖曳或<span className="upload-link upload-link-orange">點擊上傳</span> 圖片
          </div>
          <div className="upload-hint">支援 JPG/PNG，AI 會分析截圖中的遊戲介面元素</div>
          <input
            ref={imgInputRef} type="file" multiple accept="image/*"
            className="hidden-input"
            onChange={(e) => { handleImgUpload(e.target?.files); if (e.target) e.target.value = ""; }}
          />
        </div>
        {imgs.length > 0 && (
          <div className="img-preview-grid">
            {imgs.map((f, i) => (
              <div key={i} className="img-preview-item">
                {f.dataUrl
                  ? <img src={f.dataUrl} alt={f.name} />
                  : <div className="img-preview-placeholder"><span>🎬</span></div>
                }
                <div className="img-preview-name">{f.name}</div>
                <button className="img-preview-remove" onClick={() => setImgs((p) => p.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ─ 4. Quick Templates ─ */}
      <Section color={mc.light} title="⚡ 快速範本" sub="點擊範本一鍵帶入遊戲類型與功能特徵，省去手動勾選" badge={activeTemplate ? "已選取" : ""}>
        <div className="template-grid">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              active={activeTemplate === tpl.id}
              onClick={() => handleTemplateSelect(tpl)}
              mode={mode}
            />
          ))}
        </div>
      </Section>

      {/* ─ 5. Game Type ─ */}
      <Section color={mc.light} title="遊戲類型" sub="選擇最接近的類型（單選）" badge={gt ? "✓" : ""}>
        <div className="chip-grid chip-grid-type">
          {gameTypes.map((g) => (
            <Chip key={g.id} label={g.label} icon={g.icon} desc={g.desc} wide
              active={gt === g.id}
              onClick={() => { setGt((p) => (p === g.id ? "" : g.id)); setActiveTemplate(""); }}
              mode={mode}
            />
          ))}
        </div>
        {mode === "slot" && (
          <div className="paylines-row">
            <div className="paylines-label">
              <span className="paylines-icon">🎯</span>
              <span>賠付線數</span>
              <span className="paylines-optional">（選填）</span>
            </div>
            <TextInput placeholder="輸入賠付線數，例：20、50、243、1024" inputRef={payRef} style={{ maxWidth: "320px" }} />
            <div className="paylines-hint">常見值：20 線、50 線、243 ways、1024 ways、Megaways (最高 117649)</div>
          </div>
        )}
      </Section>

      {/* ─ 6. Features ─ */}
      <Section color={mc.light} title="功能特徵" sub="勾選遊戲包含的功能（可複選，懸停查看說明）" badge={feat.size > 0 ? `${feat.size} 項` : ""}>
        <div className="chip-grid chip-grid-features">
          {features.map((f) => (
            <Chip key={f.id} label={f.label} icon={f.icon} desc={f.desc}
              active={feat.has(f.id)}
              onClick={() => { tog(setFeat, f.id); setActiveTemplate(""); }}
              mode={mode}
            />
          ))}
        </div>
        {mode === "slot" && feat.has("jackpot") && (
          <div style={{ marginTop: "10px" }}>
            <TextInput placeholder="Jackpot 層級：MINI / MINOR / MAJOR / GRAND" inputRef={jpRef} style={{ maxWidth: "400px" }} />
          </div>
        )}
      </Section>

      {/* ─ 7. Platforms ─ */}
      <Section color="#fbbf24" title="支援平台" badge={`${plat.size} 個`}>
        <div className="chip-grid">
          {PLATFORMS.map((p) => (
            <Chip key={p.id} label={p.label} icon=""
              active={plat.has(p.id)}
              onClick={() => tog(setPlat, p.id)}
              mode={mode}
            />
          ))}
        </div>
      </Section>

      {/* ─ 8. Supplemental (collapsed) ─ */}
      <Section color="#5e5a6e" title="補充說明（選填）" sub="研發需求或額外指定關注項目" defaultOpen={false}>
        <Label>研發 / 主辦需求</Label>
        <TextArea
          placeholder={devPlaceholders[mode]}
          inputRef={devRef}
          rows={4}
        />

        <div style={{ marginTop: "14px" }}>
          <Label>額外關注項目（一行一個）</Label>
          <TextArea
            placeholder={"例：\nVIP 加乘倍率正確\n斷線重連後遊戲狀態恢復"}
            inputRef={extRef}
            rows={2}
          />
        </div>
      </Section>

      {/* Submit */}
      <button className={`btn-primary mode-${mode}`} onClick={handleGenerate}>
        🚀 產生檢驗表並下載
      </button>

      {/* Footer hint */}
      <div className="footer-hint">
        💡 使用 Flash-Lite 模型最省額度（每日 1000 次免費）
      </div>
    </div>
  );
}
