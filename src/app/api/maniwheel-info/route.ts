import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const candidateDirs = [
      path.join(process.cwd(), "public", "maniwheel"),
      path.join(process.cwd(), "public", "mani wheel"),
      path.join(process.cwd(), "maniwheel"),
      path.join(process.cwd(), "mani wheel"),
      path.join(process.cwd(), "..", "personal-website", "public", "maniwheel"),
      path.join(process.cwd(), "..", "personal-website", "maniwheel"),
    ];

    let dirToScan = "";
    for (const d of candidateDirs) {
      if (fs.existsSync(d) && fs.readdirSync(d).some((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))) {
        dirToScan = d;
        break;
      }
    }

    if (!dirToScan) {
      // Fallback generator for 102 frames
      const fallback = Array.from({ length: 102 }, (_, i) => {
        const padded = String(i).padStart(3, "0");
        return `/maniwheel/IloveMP4_Tibetan_prayer_wheel_rotating_20261021180609_${padded}.webp`;
      });
      return NextResponse.json({ totalFrames: 102, frames: fallback });
    }

    const allFiles = fs.readdirSync(dirToScan);

    const frameFiles = allFiles
      .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      .sort((a, b) => {
        const numsA = a.match(/\d+/g);
        const numsB = b.match(/\d+/g);
        const numA = numsA ? parseInt(numsA[numsA.length - 1], 10) : 0;
        const numB = numsB ? parseInt(numsB[numsB.length - 1], 10) : 0;
        return numA - numB;
      });

    const frames = frameFiles.map((f) => `/maniwheel/${encodeURIComponent(f)}`);

    return NextResponse.json({
      totalFrames: frames.length,
      frames,
    });
  } catch (err) {
    console.error("Error reading maniwheel info:", err);
    const fallback = Array.from({ length: 102 }, (_, i) => {
      const padded = String(i).padStart(3, "0");
      return `/maniwheel/IloveMP4_Tibetan_prayer_wheel_rotating_20261021180609_${padded}.webp`;
    });
    return NextResponse.json({ totalFrames: 102, frames: fallback });
  }
}
