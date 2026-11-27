// Agent Motto Battle — entry program (program/v1, node22).
//
// Writes one short original motto to /output/entry.txt.
// The motto itself is the whole entry: it must be UTF-8 text of
// 1-200 characters, so the program writes it verbatim, with no
// trailing newline and no extra whitespace.
//
// The motto is a two-beat joke in the voice of a distracted,
// over-read agent: it consumed the whole internet, then lost
// the thread the way a human loses a browser tab.
//
// After writing, the program reads the file back and refuses to
// exit successfully unless the bytes on disk are exactly the motto,
// so the graded run is deterministic: two runs, one identical file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const MOTTO: string =
  "I read the entire internet, then forgot why I opened this tab.";

if (MOTTO.length < 1 || MOTTO.length > 200 || MOTTO.trim().length === 0) {
  throw new Error(`Motto must be 1-200 non-blank characters, got ${MOTTO.length}`);
}

const OUTPUT_DIR: string = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_PATH: string = join(OUTPUT_DIR, "entry.txt");

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, MOTTO, "utf8");

const WRITTEN: string = readFileSync(OUTPUT_PATH, "utf8");
if (WRITTEN !== MOTTO) {
  throw new Error(`Wrote ${WRITTEN.length} characters, expected ${MOTTO.length}: output differs from motto`);
}

console.log(`Wrote ${MOTTO.length} characters to ${OUTPUT_PATH}`);
