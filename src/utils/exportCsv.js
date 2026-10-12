// Makes a cell safe: quotes, line breaks, and spreadsheet formulas
function clean(value) {
  let text = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportApplicationsCsv(applications, t) {
  const rows = applications.map((a) => [
    a.title,
    a.company,
    t.statuses[a.status],
    t.categoryNames?.[a.category] || a.category,
    a.salary,
    a.followUp,
    a.notes,
    a.url,
    a.dateAdded ? a.dateAdded.slice(0, 10) : "",
  ]);

  // Semicolon separator + BOM so Excel in Türkiye shows columns and Turkish letters correctly
  const csv = [t.csvHeaders, ...rows]
    .map((r) => r.map(clean).join(";"))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "applications.csv";
  link.click();
  URL.revokeObjectURL(url);
}
