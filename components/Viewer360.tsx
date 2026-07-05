"use client";

/**
 * Interaktive Rundum-Ansicht: Ziehen (oder Slider) dreht die Perspektive
 * durch echte Aussenaufnahmen rund ums Fahrzeug.
 */

import Image from "next/image";
import { useRef, useState } from "react";

export default function Viewer360({ frames }: { frames: string[] }) {
  const [frame, setFrame] = useState(1);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startFrame = useRef(0);

  const onDown = (clientX: number) => {
    setDragging(true);
    startX.current = clientX;
    startFrame.current = frame;
  };
  const onMove = (clientX: number) => {
    if (!dragging) return;
    const delta = Math.round((clientX - startX.current) / 45);
    setFrame(((startFrame.current + delta) % frames.length + frames.length) % frames.length);
  };

  return (
    <div className="overflow-hidden rounded-3xl glass p-4 shadow-soft sm:p-6">
      <div
        role="slider"
        aria-label="Rundum-Ansicht — ziehen zum Drehen"
        aria-valuemin={0}
        aria-valuemax={frames.length - 1}
        aria-valuenow={frame}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setFrame((f) => (f + 1) % frames.length);
          if (e.key === "ArrowLeft") setFrame((f) => (f - 1 + frames.length) % frames.length);
        }}
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={() => setDragging(false)}
      >
        {frames.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Carado T447 Ansicht ${i + 1} von ${frames.length}`}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={`object-cover transition-opacity duration-150 ${i === frame ? "opacity-100" : "opacity-0"}`}
            draggable={false}
            priority={i === 1}
          />
        ))}
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-white">
          ⟲ Ziehen zum Drehen · {frame + 1}/{frames.length}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={frames.length - 1}
        value={frame}
        onChange={(e) => setFrame(Number(e.target.value))}
        aria-label="Perspektive wählen"
        className="mt-4 w-full accent-terra-500"
      />
    </div>
  );
}
