import { copyFile, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist/demi-yard-material-calculator.zip");
const legacyOutput = join(root, "dist/yard-material-calculator.zip");
const stagingRoot = join(root, "dist/staging");
const pluginRoot = join(stagingRoot, "demi-yard-material-calculator");
const files = [
  "LICENSE",
  "README.md",
  "third-party-notices.txt",
  "assets/editor.css",
  "assets/editor.asset.php",
  "assets/editor.js",
  "assets/widget.js",
  "assets/widget.sha256",
  "block.json",
  "readme.txt",
  "render.php",
  "demi-yard-material-calculator.php",
];

await mkdir(dirname(output), { recursive: true });
await rm(output, { force: true });
await rm(legacyOutput, { force: true });
await rm(stagingRoot, { force: true, recursive: true });

for (const file of files) {
  const destination = join(pluginRoot, file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, file), destination);
}

const result = spawnSync("zip", ["-q", "-r", output, "demi-yard-material-calculator"], {
  cwd: stagingRoot,
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status ?? 1);

await rm(stagingRoot, { force: true, recursive: true });
console.log(output);
