import Papa from "papaparse";
export async function loadCsvTemplate(
  path: string
): Promise<{ rowCode: string; item: string }[]> {
  const res = await fetch(path);
  const text = await res.text();

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data.map((row) => ({
    rowCode: row.Rows.trim(),
    id: row.ID.trim(),
    item: row.Item.trim(),
  }));
}
