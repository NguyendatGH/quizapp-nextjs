import * as fs from "fs";
import path from "path";

export interface QuizSourceInfo {
  id: string;
  fileName: string;
  title: string;
  questionCount: number;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const EXCLUDED_DIRS = new Set(["old"]);

/** Optional friendly titles for known datasets */
const TITLE_MAP: Record<string, string> = {
  "mkt301_flashcards.json": "MKT301",
  "MLN_DATA.json": "MLN",
  "MLN_DATA2.json": "MLN (Full)",
  "DATA.json": "DATA",
  "DATA_swt.json": "DATA SWT",
  "PT2_swt.json": "PT2 SWT",
  "QUESTION_formatted.json": "Questions",
};

export function formatSourceTitle(fileName: string): string {
  if (TITLE_MAP[fileName]) return TITLE_MAP[fileName];
  return fileName
    .replace(/\.json$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isSafeRelativeId(id: string): boolean {
  if (!id || id.includes("\0") || id.includes("..")) return false;
  if (path.isAbsolute(id)) return false;
  if (!id.toLowerCase().endsWith(".json")) return false;
  return /^[a-zA-Z0-9_./-]+$/.test(id);
}

/** Resolve a source id (relative to public/) to an absolute path inside public. */
export function resolveQuizFile(sourceId: string): string | null {
  if (!isSafeRelativeId(sourceId)) return null;
  const topSegment = sourceId.split("/")[0];
  if (EXCLUDED_DIRS.has(topSegment)) return null;
  const resolved = path.resolve(PUBLIC_DIR, sourceId);
  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== PUBLIC_DIR) {
    return null;
  }
  if (!resolved.toLowerCase().endsWith(".json")) return null;
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return null;
  return resolved;
}

function collectJsonFiles(dir: string, prefix = ""): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      results.push(...collectJsonFiles(full, rel));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
      results.push(rel.replace(/\\/g, "/"));
    }
  }
  return results;
}

export function listQuizSources(): QuizSourceInfo[] {
  const ids = collectJsonFiles(PUBLIC_DIR);
  const sources: QuizSourceInfo[] = [];

  for (const id of ids) {
    const filePath = resolveQuizFile(id);
    if (!filePath) continue;
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) continue;
      const fileName = path.basename(id);
      sources.push({
        id,
        fileName,
        title: formatSourceTitle(fileName),
        questionCount: data.length,
      });
    } catch {
      // skip invalid json
    }
  }

  return sources.sort((a, b) => a.title.localeCompare(b.title));
}

export function loadQuizQuestions(sourceId: string): unknown[] | null {
  const filePath = resolveQuizFile(sourceId);
  if (!filePath) return null;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}
