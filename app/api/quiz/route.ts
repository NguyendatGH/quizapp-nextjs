import { NextRequest, NextResponse } from "next/server";
import { loadQuizQuestions, listQuizSources } from "@/lib/quizSources";

export async function GET(req: NextRequest) {
  const sourceParam = req.nextUrl.searchParams.get("source");
  const sources = listQuizSources();

  const sourceId =
    sourceParam && sources.some((s) => s.id === sourceParam)
      ? sourceParam
      : sources[0]?.id;

  if (!sourceId) {
    return NextResponse.json(
      { error: "No quiz datasets found in public/" },
      { status: 404 }
    );
  }

  const data = loadQuizQuestions(sourceId);
  if (!data) {
    return NextResponse.json(
      { error: "Quiz source not found or invalid" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
