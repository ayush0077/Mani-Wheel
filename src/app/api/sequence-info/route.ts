import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const candidateDirs = [
      path.join(process.cwd(), "public", "sequence"),
      path.join(process.cwd(), "sequence"),
    ];

    let dirToScan = "";
    for (const d of candidateDirs) {
      if (
        fs.existsSync(/*turbopackIgnore: true*/ d) &&
        fs.readdirSync(/*turbopackIgnore: true*/ d).some((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      ) {
        dirToScan = d;
        break;
      }
    }

    const fallbackFrames = Array.from({ length: 128 }, (_, i) => {
      const padded = String(i).padStart(3, "0");
      return `/sequence/mylivewallpapers-com-Torii-Lone-Samurai-4K_${padded}.webp`;
    });

    if (!dirToScan) {
      return NextResponse.json({ totalFrames: fallbackFrames.length, frames: fallbackFrames });
    }

    const allFiles = fs.readdirSync(/*turbopackIgnore: true*/ dirToScan);

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
    const fallbackFrames = Array.from({ length: 128 }, (_, i) => {
      const padded = String(i).padStart(3, "0");
      return `/sequence/mylivewallpapers-com-Torii-Lone-Samurai-4K_${padded}.webp`;
    });
    return NextResponse.json({ totalFrames: fallbackFrames.length, frames: fallbackFrames });
  }
}
