import * as XLSX from "xlsx";

/**
 * Read all text items from an uploaded Excel file for dedup.
 * @param {Uint8Array} data - Excel file data
 * @returns {string[]} - Array of text items found
 */
export function readExcelItems(data) {
  const wb = XLSX.read(data, { type: "array" });
  const items = [];
  wb.SheetNames.forEach((name) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 });
    rows.forEach((row) => {
      if (!row) return;
      row.forEach((cell) => {
        if (cell && typeof cell === "string" && cell.length > 4 && cell.length < 300) {
          items.push(cell.trim());
        }
      });
    });
  });
  return items;
}

/**
 * Analyze the uploaded Excel's structure (headers, column widths, sheet name pattern).
 * @param {Uint8Array} data - Excel file data
 * @returns {object} - { headers, colWidths, sheetName, headerRow }
 */
export function analyzeExcelStructure(data) {
  const wb = XLSX.read(data, { type: "array" });
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

  // Find header row (first row with 2+ non-empty cells)
  let headerRow = 0;
  let headers = [];
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    if (!row) continue;
    const nonEmpty = row.filter((c) => c !== undefined && c !== null && String(c).trim() !== "");
    if (nonEmpty.length >= 2) {
      headers = row.map((c) => (c !== undefined && c !== null ? String(c).trim() : ""));
      headerRow = i;
      break;
    }
  }

  // Get column widths from original
  const colWidths = firstSheet["!cols"] || [];

  return {
    headers,
    colWidths,
    sheetName: wb.SheetNames[0],
    headerRow,
  };
}

/**
 * Build and download an Excel file from generated sections.
 * If uploadedStructure is provided, match its header/format.
 * @param {Array} sections - Array of {title, items: [{text, note}]}
 * @param {string[]} platLabels - Platform labels for columns
 * @param {string} gameName - Game name for filename
 * @param {string} modeLabel - Game mode label
 * @param {object|null} uploadedStructure - Structure from analyzeExcelStructure()
 * @returns {string} - Downloaded filename
 */
export function buildAndDownloadExcel(sections, platLabels, gameName, modeLabel = "", uploadedStructure = null) {
  let hdr, aoa, colConfig;

  if (uploadedStructure && uploadedStructure.headers.length >= 2) {
    // ── Match uploaded structure ──
    hdr = [...uploadedStructure.headers];
    // Ensure we have at least: 編號, 內容, ...platforms, 備註
    // Use the original headers as-is
    aoa = [hdr];
    colConfig = uploadedStructure.colWidths.length > 0
      ? uploadedStructure.colWidths
      : hdr.map((_, i) => ({ wch: i === 0 ? 6 : i === 1 ? 72 : i === hdr.length - 1 ? 35 : 12 }));

    let gid = 0;
    sections.forEach((sec) => {
      // Category header row - put title in first column
      const catRow = new Array(hdr.length).fill("");
      catRow[0] = sec.title;
      // Fill platform columns with ✓ if they exist
      for (let i = 2; i < hdr.length - 1; i++) {
        catRow[i] = "✓";
      }
      aoa.push(catRow);

      // Item rows - match original column positions
      (sec.items || []).forEach((item) => {
        gid++;
        const row = new Array(hdr.length).fill("");
        row[0] = gid;
        row[1] = typeof item === "string" ? item : item.text || "";
        row[hdr.length - 1] = typeof item === "string" ? "" : item.note || "";
        aoa.push(row);
      });
    });
  } else {
    // ── Default structure ──
    hdr = ["編號", "檢驗內容", ...platLabels, "備註"];
    aoa = [hdr];
    colConfig = [
      { wch: 6 },
      { wch: 72 },
      ...platLabels.map(() => ({ wch: 12 })),
      { wch: 35 },
    ];

    let gid = 0;
    sections.forEach((sec) => {
      const catRow = new Array(hdr.length).fill("");
      catRow[0] = sec.title;
      platLabels.forEach((_, i) => {
        catRow[2 + i] = "✓";
      });
      aoa.push(catRow);

      (sec.items || []).forEach((item) => {
        gid++;
        const row = new Array(hdr.length).fill("");
        row[0] = gid;
        row[1] = typeof item === "string" ? item : item.text || "";
        row[hdr.length - 1] = typeof item === "string" ? "" : item.note || "";
        aoa.push(row);
      });
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = colConfig;

  const wb = XLSX.utils.book_new();
  const sheetName = uploadedStructure?.sheetName
    ? `${uploadedStructure.sheetName}_補充`
    : modeLabel ? `${modeLabel}建議補充項目` : "建議補充項目";
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

  let filename;
  if (gameName && modeLabel) {
    filename = `${gameName}_${modeLabel}QA補充檢驗表.xlsx`;
  } else if (gameName) {
    filename = `${gameName}_QA補充檢驗表.xlsx`;
  } else if (modeLabel) {
    filename = `${modeLabel}_QA補充檢驗表.xlsx`;
  } else {
    filename = "QA補充檢驗表.xlsx";
  }

  XLSX.writeFile(wb, filename);
  return filename;
}
