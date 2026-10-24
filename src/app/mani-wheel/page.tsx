import type { Metadata } from "next";
import ManiWheelExperience from "@/components/mani-wheel/ManiWheelExperience";

export const metadata: Metadata = {
  title: "Mani Wheel — Spin to Receive Karma | Ayush",
  description:
    "Interactive Himalayan Tibetan Buddhist prayer wheel (Mani Wheel). Drag to rotate clockwise and receive sacred karma blessings.",
};

export default function ManiWheelPage() {
  return <ManiWheelExperience />;
}
