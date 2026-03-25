import React, { useState, useRef, useCallback } from "react";
import { GAME_MODES, PLATFORMS, getGameTypes, getFeatures } from "./constants";
import { getModeColors } from "./theme";
import { TextInput, TextArea, Chip, Section, Label, TabBar } from "./components";
import { callGemini, buildPrompt, GEMINI_MODELS } from "./gemini";
import { readExcelItems, buildAndDownloadExcel } from "./excel";

export default function App() {
  const [mode, setMode] = useState("slot");
  const [gt, setGt] = useState("");
  const [feat, setFeat] = useState(new Set());
  const [plat, setPlat] = useState(new Set(["ios", "android", "win"]));
  const [hasXl, setHasXl] = useState(false);
  const [xlName, setXlName] = useState("");
  const [xlData, setXlData] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [resultMsg, setResultMsg] = useState("");
  const [resultFile, setResultFile] = useState("");
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");

  const gnRef = useRef(null);
  const pnRef = useRef(null);
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
  }, []);

  const handleXlUpload = useCallback((file) => {
    if (!file) return;
    setHasXl(true);
    setXlName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setXlData(new Uint8Array(e.target.result));
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

      const sections = await callGemini(apiKey, prompt, selectedModel);

      const modeLabel = GAME_MODES.find((m) => m.id === mode)?.label || "";
      const fn = buildAndDownloadExcel(sections, platLabels, gn, modeLabel);
      const total = sections.reduce((s, sec) => s + (sec.items?.length || 0), 0);

      setResultFile(fn);
      setResultMsg(`${sections.length} 個分類、${total} 個項目`);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(e.message || "發生錯誤");
      setStatus("error");
    }
  }, [mode, gt, feat, plat, xlData, selectedModel]);

  // ── Loading Screen ──
  if (status === "loading") {
    return (
      <div className="status-screen">
        <div className="loading-spinner" style={{ borderTopColor: mc.main }} />
        <div className="status-title">AI 正在分析並產生檢驗表...</div>
        <div style={{ fontSize: "13px", color: "#5e5a6e", marginTop: "6px" }}>
          根據你的{GAME_MODES.find((m) => m.id === mode)?.label || "遊戲"}資訊
          {hasXl ? "與既有檢驗單" : ""}，以品檢角度產出補充項目
        </div>
        <div style={{ fontSize: "12px", color: "#3d3a4e", marginTop: "14px", animation: "pulse 1.5s ease-in-out infinite" }}>
          約 10-30 秒...
        </div>
      </div>
    );
  }

  // ── Done Screen ──
  if (status === "done") {
    return (
      <div className="status-screen">
        <div className="success-icon">✓</div>
        <div className="status-title">檢驗表已下載</div>
        <div className="status-file" style={{ color: mc.light }}>{resultFile}</div>
        <div className="status-msg">{resultMsg}</div>
        {hasXl && (
          <div className="warning-box">
            產出的是獨立的補充檢驗表，已根據「{xlName}」的內容去重。原始檔案未被修改。
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
    );
  }

  const gameTypes = getGameTypes(mode);
  const features = getFeatures(mode);

  // Mode-specific labels
  const modeLabels = {
    slot: { devTitle: "研發 / 主辦需求（選填）", devSub: "貼上規格書或驗收需求，沒有可跳過" },
    fishing: { devTitle: "研發 / 主辦需求（選填）", devSub: "貼上武器設定、魚種表或規格需求，沒有可跳過" },
    casual: { devTitle: "研發 / 主辦需求（選填）", devSub: "貼上遊戲規則或驗收需求，沒有可跳過" },
  };
  const ml = modeLabels[mode];

  const devPlaceholders = {
    slot: "例：\n1. 盤面 3x5 消除類 SLOT\n2. 消除 1/2/3/4 次獲得乘倍 x1/x2/x3/x5\n3. 3 個 SCATTER 觸發 10 局 Free Game\n4. WILD 可替代除 SCATTER 以外所有符號\n5. 購買 Free Game 花費 100 倍 BET",
    fishing: "例：\n1. 砲台等級 1-10，每級消耗倍率不同\n2. Boss 每 3 分鐘出現一次\n3. 特殊魚種：炸彈魚範圍殺傷、電鰻連鎖\n4. 鎖定功能需 VIP 等級 3+ 開啟\n5. 4 人座位同場",
    casual: "例：\n1. 猜大小，52 張牌不含鬼牌\n2. 連續猜對可加倍，最高 5 連\n3. A 視為最小，K 視為最大\n4. 平手時自動歸還押注\n5. 含幸運轉盤附加玩法",
  };

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
        <div className="header-sub">選擇遊戲類別 → 填寫資訊 → AI 分析 → 下載 Excel</div>
      </div>

      {/* Tab Bar */}
      <TabBar tabs={GAME_MODES} activeId={mode} onChange={handleModeChange} />

      {/* Error */}
      {error && <div className="error-box">{error.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>}

      {/* API Key & Model */}
      <Section color="#fbbf24" title="Gemini API 設定" sub="前往 aistudio.google.com → Get API Key → Create">
        <div className="api-key-row">
          <TextInput
            placeholder="貼上你的 Gemini API Key"
            inputRef={apiKeyRef}
            type={showKey ? "text" : "password"}
          />
          <button className="btn-show-key" onClick={() => setShowKey((p) => !p)}>
            {showKey ? "隱藏" : "顯示"}
          </button>
        </div>
        <div className="model-selector">
          <Label>AI 模型</Label>
          <select
            className="form-select"
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

      {/* Excel Upload */}
      <Section color="#10b981" title="匯入既有 Excel（選填）" sub="上傳現有檢驗單，AI 會讀取內容避免產出重複項目">
        {!hasXl ? (
          <div
            className="upload-zone upload-zone-green"
            onClick={() => xlInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer?.files?.[0]; if (f) handleXlUpload(f); }}
          >
            <div className="upload-icon">📊</div>
            <div className="upload-text">
              拖曳或<span className="upload-link upload-link-green">點擊上傳</span> .xlsx
            </div>
            <input
              ref={xlInputRef} type="file" accept=".xlsx,.xls"
              className="hidden-input"
              onChange={(e) => { const f = e.target?.files?.[0]; if (f) handleXlUpload(f); if (e.target) e.target.value = ""; }}
            />
          </div>
        ) : (
          <div className="uploaded-file">
            <span className="uploaded-file-name">✓ {xlName}</span>
            <button
              className="uploaded-file-remove"
              onClick={() => { setHasXl(false); setXlName(""); setXlData(null); }}
            >移除</button>
          </div>
        )}
      </Section>

      {/* Image/Video Upload */}
      <Section color="#fb923c" title="上傳截圖 / 影片（選填）" sub="提供畫面幫助 AI 更精準判斷">
        <div
          className="upload-zone"
          onClick={() => imgInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleImgUpload(e.dataTransfer?.files); }}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            拖曳或<span className="upload-link upload-link-orange">點擊上傳</span>
          </div>
          <input
            ref={imgInputRef} type="file" multiple accept="image/*,video/*"
            className="hidden-input"
            onChange={(e) => { handleImgUpload(e.target?.files); if (e.target) e.target.value = ""; }}
          />
        </div>
        {imgs.length > 0 && (
          <div className="img-preview-grid">
            {imgs.map((f, i) => (
              <div key={i} className="img-preview-item">
                {f.dataUrl
                  ? <img src={f.dataUrl} alt="" />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "18px" }}>🎬</span></div>
                }
                <button className="img-preview-remove" onClick={() => setImgs((p) => p.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Game Type */}
      <Section color={mc.light} title="遊戲類型" sub="選擇最接近的類型，幫助 AI 更精準地產出檢驗項目">
        <div className="chip-grid chip-grid-wide">
          {gameTypes.map((g) => (
            <Chip key={g.id} label={g.label} icon={g.icon} desc={g.desc} wide
              active={gt === g.id}
              onClick={() => setGt((p) => (p === g.id ? "" : g.id))}
              mode={mode}
            />
          ))}
        </div>
        {mode === "slot" && (
          <div style={{ marginTop: "12px" }}>
            <Label>賠付線數（選填）</Label>
            <TextInput placeholder="例：50" inputRef={payRef} style={{ maxWidth: "160px" }} />
          </div>
        )}
      </Section>

      {/* Dev Requirements */}
      <Section color="#f472b6" title={ml.devTitle} sub={ml.devSub}>
        <TextArea
          placeholder={devPlaceholders[mode]}
          inputRef={devRef}
          rows={5}
        />
      </Section>



      {/* Features */}
      <Section color={mc.light} title="功能特徵" sub="勾選遊戲包含的功能，滑鼠懸停可查看說明（可複選）">
        <div className="chip-grid">
          {features.map((f) => (
            <Chip key={f.id} label={f.label} icon={f.icon} desc={f.desc}
              active={feat.has(f.id)}
              onClick={() => tog(setFeat, f.id)}
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

      {/* Platforms */}
      <Section color="#fbbf24" title="支援平台">
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

      {/* Extra Items */}
      <Section color="#5e5a6e" title="額外指定項目（選填）" sub="一行一個，指定你特別想要 AI 關注的測試面向">
        <TextArea
          placeholder={"例：\nVIP 加乘倍率正確\n斷線重連後遊戲狀態恢復"}
          inputRef={extRef}
          rows={3}
        />
      </Section>

      {/* Submit */}
      <button className={`btn-primary mode-${mode}`} onClick={handleGenerate}>
        產生檢驗表並下載 ↓
      </button>
    </div>
  );
}
