import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const decoded = decodeURIComponent(filename);

  const candidatePaths = [
    path.join(process.cwd(), "public", "maniwheel", decoded),
    path.join(process.cwd(), "public", "mani wheel", decoded),
    path.join(process.cwd(), "maniwheel", decoded),
    path.join(process.cwd(), "mani wheel", decoded),
    path.join(process.cwd(), "..", "personal-website", "maniwheel", decoded),
    path.join(process.cwd(), "..", "personal-website", "public", "maniwheel", decoded),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(decoded).toLowerCase();
      let contentType = "image/webp";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  return new NextResponse("File not found", { status: 404 });
}
