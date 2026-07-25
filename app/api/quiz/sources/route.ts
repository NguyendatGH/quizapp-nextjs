import { NextResponse } from "next/server";
import { listQuizSources } from "@/lib/quizSources";

export async function GET() {
  const sources = listQuizSources();
  return NextResponse.json({ sources });
}
