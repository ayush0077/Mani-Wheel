import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const decoded = decodeURIComponent(filename);

  // Search paths in order: public/sequence, root sequence, adjacent project
  const candidatePaths = [
    path.join(process.cwd(), "public", "sequence", decoded),
    path.join(process.cwd(), "sequence", decoded),
    path.join(process.cwd(), "..", "personal-website", "sequence", decoded),
    path.join(process.cwd(), "..", "personal-website", "public", "sequence", decoded),
    path.join(process.cwd(), "..", "Personal Website", "sequence", decoded),
    path.join(process.cwd(), "..", "Personal Website", "public", "sequence", decoded),
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
