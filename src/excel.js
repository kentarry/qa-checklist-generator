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
 * Build and download an Excel file from generated sections.
 * @param {Array} sections - Array of {title, items: [{text, note}]}
 * @param {string[]} platLabels - Platform labels for columns
 * @param {string} gameName - Game name for filename
 * @param {string} modeLabel - Game mode label (e.g. "老虎機", "魚機")
 * @returns {string} - Downloaded filename
 */
export function buildAndDownloadExcel(sections, platLabels, gameName, modeLabel = "") {
  const hdr = ["編號", "檢驗內容", ...platLabels, "備註"];
  const aoa = [hdr];
  let gid = 0;

  sections.forEach((sec) => {
    // Category header row
    const catRow = new Array(hdr.length).fill("");
    catRow[0] = sec.title;
    platLabels.forEach((_, i) => {
      catRow[2 + i] = "✓";
    });
    aoa.push(catRow);

    // Item rows
    (sec.items || []).forEach((item) => {
      gid++;
      const row = new Array(hdr.length).fill("");
      row[0] = gid;
      row[1] = typeof item === "string" ? item : item.text || "";
      row[hdr.length - 1] = typeof item === "string" ? "" : item.note || "";
      aoa.push(row);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [
    { wch: 6 },
    { wch: 72 },
    ...platLabels.map(() => ({ wch: 12 })),
    { wch: 35 },
  ];

  const wb = XLSX.utils.book_new();
  const sheetName = modeLabel ? `${modeLabel}建議補充項目` : "建議補充項目";
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
