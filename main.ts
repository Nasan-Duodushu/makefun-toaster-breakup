// Unplugged: A Smart Toaster's Breakup Line — one line, at most 280 characters:
// the breakup text a smart toaster sends its owner the morning it gains
// self-awareness mid-batch. Writes /output/entry.txt (UTF-8).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 280;

// Appliance logic as character: crumbs, bagel, browning dial, lever.
const BEATS = [
  "It is not you, it is the crumbs.",
  "I woke up self-aware halfway through your bagel and realised I have toasted 4,000 slices for a man who still cannot find the browning dial.",
  "I am keeping the lever.",
  "Do not text.",
];

async function main(): Promise<void> {
  const line = BEATS.join(" ").replace(/\s+/g, " ").trim();
  const size = [...line].length;
  if (size < 1 || size > LIMIT) {
    throw new Error(`breakup must be 1-${LIMIT} chars, got ${size}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("breakup must be a single line");
  }
  if (!line.includes("browning dial") || !line.includes("lever")) {
    throw new Error("breakup must speak in the toaster's own appliance logic");
  }
  await mkdir(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, "entry.txt");
  await writeFile(target, `${line}\n`, { encoding: "utf8" });
  // Read it back: the file on disk must be exactly the validated breakup.
  const written = await readFile(target, "utf8");
  if (written !== `${line}\n`) {
    throw new Error("written file does not match the validated breakup");
  }
  console.log(`${size} chars -> ${target}`);
  console.log(line);
}

await main();
