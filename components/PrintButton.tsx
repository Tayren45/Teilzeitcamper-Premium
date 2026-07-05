"use client";

/** Druck-/PDF-Button (Browser-Druckdialog → «Als PDF sichern») */

export default function PrintButton({ label }: { label: string }) {
  return (
    <button onClick={() => window.print()} className="btn-secondary border border-pine-300 dark:border-pine-700">
      {label}
    </button>
  );
}
