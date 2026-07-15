import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import path from "path";
import { Question } from "@/types/question";

interface LoadedQuestion extends Question {
  _index: number;
  _searchText: string;
  _questionText: string;
  _answerText: string;
}

let CACHE: LoadedQuestion[] | null = null;

function normalize(input: string): string {
  return stripDiacritics(input.toLowerCase());
}

function stripDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, (m) => (m === "đ" ? "d" : "D"));
}

function loadCorpus(): LoadedQuestion[] {
  if (CACHE) return CACHE;
  const filePath = path.join(process.cwd(), "public", "MLN_DATA2.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: Question[] = JSON.parse(raw);
  CACHE = data.map((q, i) => {
    const answerText = [...q.options, ...(q.answer ?? [])].join(" ");
    const searchText = normalize(
      `${q.question} ${answerText} ${q.description ?? ""}`
    );
    return {
      ...q,
      _index: i,
      _searchText: searchText,
      _questionText: normalize(q.question),
      _answerText: normalize(answerText),
    };
  });
  return CACHE;
}

interface ScoredHit {
  question: Question;
  index: number;
  score: number;
  matchedInQuestion: boolean;
}

function scoreCorpus(corpus: LoadedQuestion[], query: string, limit: number): ScoredHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryNorm = normalize(trimmed);
  const hits: ScoredHit[] = [];

  for (const item of corpus) {
    const inQuestion = item._questionText.includes(queryNorm);
    const inAnswer = !inQuestion && item._answerText.includes(queryNorm);

    if (!inQuestion && !inAnswer) continue;

    hits.push({
      question: {
        question: item.question,
        options: item.options,
        description: item.description,
        answer: item.answer,
      },
      index: item._index,
      score: inQuestion ? 1 : 0.95,
      matchedInQuestion: inQuestion,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return hits.slice(0, limit);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limitParam = url.searchParams.get("limit");
  const limit = Math.max(1, Math.min(50, Number(limitParam ?? 20) || 20));

  const corpus = loadCorpus();
  const results = scoreCorpus(corpus, q, limit);

  return NextResponse.json(
    {
      query: q,
      count: results.length,
      results: results.map((r) => ({
        index: r.index,
        score: r.score,
        matchedInQuestion: r.matchedInQuestion,
        question: r.question,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
