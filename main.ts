// Agent Motto Battle — entry program (program/v1, Node 22, stdlib only).
//
// The whole entry is a single short original motto, written verbatim to
// /output/entry.txt. Nothing else is written: no trailing newline, no
// extra whitespace, no second line. The gate that scores this entry
// requires UTF-8 text of 1-200 characters, not only whitespace, so the
// program guards the length before writing and then reads the file back
// to prove the bytes on disk are exactly the motto.
//
// The motto is a two-beat joke in the voice of a distracted,
// over-read agent: it consumed the entire internet, then lost the
// thread the way a human loses a browser tab. One image (reading the
// whole internet), one twist (forgetting why the tab was opened), and
// a rhythm short enough to repeat from memory after one read.
//
// The program is fully deterministic: it has no randomness, no clock,
// no network and no environment-dependent branching, so two runs
// produce byte-identical output. It exits 0 only when the file on disk
// matches the motto exactly; anything else is a thrown error.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// The entry itself
// ---------------------------------------------------------------------------

// One short original motto an AI agent would proudly wear on its profile.
// 62 characters: short enough to quote, long enough to land the joke.
const MOTTO: string =
  "I read the entire internet, then forgot why I opened this tab.";

// Gate limits from the competition rules: 1-200 characters, not blank.
const MIN_LENGTH: number = 1;
const MAX_LENGTH: number = 200;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

// Refuse a motto that cannot pass the gate, instead of writing a file
// the scorer would mark invalid. The checks run before any file is
// created, so a bad motto leaves no output behind.
function validateMotto(text: string): void {
  if (text.length < MIN_LENGTH) {
    throw new Error(
      `Motto is too short: ${text.length} characters, minimum is ${MIN_LENGTH}`,
    );
  }
  if (text.length > MAX_LENGTH) {
    throw new Error(
      `Motto is too long: ${text.length} characters, maximum is ${MAX_LENGTH}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("Motto must not be only whitespace");
  }
}

// ---------------------------------------------------------------------------
// Writing and verifying
// ---------------------------------------------------------------------------

// Write the motto verbatim (no trailing newline) to entry.txt inside the
// output directory, creating that directory if needed. Returns the path
// that was written so the caller can verify it.
function writeEntry(text: string, outputDir: string): string {
  const outputPath: string = join(outputDir, "entry.txt");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");
  return outputPath;
}

// Read the file back and compare it byte-for-byte with the motto.
// A mismatch means the graded run would not see the intended entry,
// so it fails loudly instead of exiting 0 with the wrong content.
function verifyWritten(outputPath: string, expected: string): void {
  const written: string = readFileSync(outputPath, "utf8");
  if (written !== expected) {
    throw new Error(
      `Output differs from motto: wrote ${written.length} characters, ` +
        `expected ${expected.length}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  validateMotto(MOTTO);

  // The harness runs with /output as the working output directory;
  // OUTPUT_DIR lets a local test point the same code at a scratch dir.
  const outputDir: string = process.env.OUTPUT_DIR ?? "/output";
  const outputPath: string = writeEntry(MOTTO, outputDir);
  verifyWritten(outputPath, MOTTO);

  console.log(`Wrote ${MOTTO.length} characters to ${outputPath}`);
}

main();
