import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const candidateDirs = [
      path.join(process.cwd(), "public", "sequence"),
      path.join(process.cwd(), "sequence"),
      path.join(process.cwd(), "..", "personal-website", "public", "sequence"),
      path.join(process.cwd(), "..", "personal-website", "sequence"),
      path.join(process.cwd(), "..", "Personal Website", "public", "sequence"),
      path.join(process.cwd(), "..", "Personal Website", "sequence"),
    ];

    let dirToScan = "";
    for (const d of candidateDirs) {
      if (fs.existsSync(d) && fs.readdirSync(d).some((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))) {
        dirToScan = d;
        break;
      }
    }

    if (!dirToScan) {
      return NextResponse.json({ totalFrames: 0, frames: [] });
    }

    const allFiles = fs.readdirSync(dirToScan);

    // Match ANY image file ending with webp, png, jpg, jpeg
    const frameFiles = allFiles
      .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      .sort((a, b) => {
        const numsA = a.match(/\d+/g);
        const numsB = b.match(/\d+/g);
        const numA = numsA ? parseInt(numsA[numsA.length - 1], 10) : 0;
        const numB = numsB ? parseInt(numsB[numsB.length - 1], 10) : 0;
        return numA - numB;
      });

    const frames = frameFiles.map((f) => `/sequence/${encodeURIComponent(f)}`);

    return NextResponse.json({
      totalFrames: frames.length,
      frames,
    });
  } catch (err) {
    console.error("Error reading sequence info:", err);
    return NextResponse.json({ totalFrames: 0, frames: [] });
  }
}
