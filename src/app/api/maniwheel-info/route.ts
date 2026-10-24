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

    if (!dirToScan) {
      const fallback = Array.from({ length: 102 }, (_, i) => {
        const padded = String(i).padStart(3, "0");
        return `/maniwheel/IloveMP4_Tibetan_prayer_wheel_rotating_20261021180609_${padded}.webp`;
      });
      return NextResponse.json({ totalFrames: 102, frames: fallback });
    }

    const allFiles = fs.readdirSync(/*turbopackIgnore: true*/ dirToScan);

    const frameFiles = allFiles
      .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      .sort((a, b) => {
        const numsA = a.match(/\d+/g);
        const numsB = b.match(/\d+/g);
        const numA = numsA ? parseInt(numsA[numsA.length - 1], 10) : 0;
        const numB = numsB ? parseInt(numsB[numsB.length - 1], 10) : 0;
        return numA - numB;
      });

    const frames =
      frameFiles.length > 0
        ? frameFiles.map((f) => `/maniwheel/${encodeURIComponent(f)}`)
        : Array.from({ length: 102 }, (_, i) => {
            const padded = String(i).padStart(3, "0");
            return `/maniwheel/IloveMP4_Tibetan_prayer_wheel_rotating_20261021180609_${padded}.webp`;
          });

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
