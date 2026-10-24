import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const decoded = decodeURIComponent(filename);

  // If running in Cloudflare Workers, fetch directly from the ASSETS binding
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.ASSETS) {
      return await ctx.env.ASSETS.fetch(request);
    }
  } catch {
    // Fall back to Node.js filesystem lookup in local dev
  }

  // Search paths in order: public/sequence, root sequence, adjacent project
  const candidatePaths = [
    path.join(process.cwd(), "public", "sequence", decoded),
    path.join(process.cwd(), "sequence", decoded),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ filePath);
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
