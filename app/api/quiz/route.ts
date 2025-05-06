import { NextResponse } from "next/server";
import * as fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "DATA.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  return NextResponse.json(data);
}
