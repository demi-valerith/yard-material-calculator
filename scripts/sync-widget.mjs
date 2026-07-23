import { createHash } from "node:crypto";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = require.resolve("@demi-valerith/yard-material-coverage-data/widget");
const destination = join(root, "assets/widget.js");

await copyFile(source, destination);
const digest = createHash("sha256").update(await readFile(destination)).digest("hex");
await writeFile(join(root, "assets/widget.sha256"), `${digest}  widget.js\n`);
console.log(`Synced widget.js (${digest})`);
