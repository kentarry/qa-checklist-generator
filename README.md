# QA Checklist Generator - 遊戲測試檢驗表

自動產生遊戲的品檢測試檢驗表，支援老虎機、魚機、休閒遊戲三種模式。

## 功能

- **三種遊戲模式** — 老虎機 🎰 / 魚機 🐟 / 休閒遊戲 🎮 一鍵切換
- **AI 模型選擇** — 可選用 Gemini 2.0 Flash / 1.5 Flash / 1.5 Pro 等多種模型
- **智慧品檢建議** — 聚焦「一般 QA 容易遺漏但出問題會很嚴重」的測試盲區
- **功能特徵說明** — 每個特徵附上完整中文描述，新手也能快速理解
- **Excel 匯入匯出** — 上傳既有檢驗單自動去重，直接下載 .xlsx
- **截圖/影片上傳** — 提供畫面輔助 AI 更精準判斷
- **響應式設計** — 手機、平板、桌面皆可流暢操作

## 使用方式

1. 取得 Gemini API Key：前往 [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create
2. 選擇遊戲模式（老虎機 / 魚機 / 休閒遊戲）
3. 填寫遊戲資訊、選擇功能特徵
4. 選擇 AI 模型（額度不足可切換其他模型）
5. 按「產生檢驗表並下載」

## 開發

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:3000`

## 技術棧

- React 18 + Vite
- SheetJS (xlsx) - Excel 讀寫
- Gemini API - AI 產生檢驗項目

## 專案結構

```
qa-checklist-generator/
├── index.html          # HTML 入口
├── package.json        # 依賴管理
├── vite.config.js      # Vite 設定
├── public/
│   └── favicon.svg     # 圖標
└── src/
    ├── main.jsx        # React 入口
    ├── styles.css      # 全域樣式（RWD + 動畫）
    ├── App.jsx         # 主元件（Tab 切換、表單、狀態管理）
    ├── components.jsx  # 共用 UI 元件（TabBar、Section、Chip）
    ├── constants.js    # 三種遊戲模式的類型與功能特徵
    ├── theme.js        # 色彩主題（含模式對應色）
    ├── gemini.js       # Gemini API 呼叫（含模型選擇 + 友善錯誤提示）
    └── excel.js        # Excel 讀寫工具
```
