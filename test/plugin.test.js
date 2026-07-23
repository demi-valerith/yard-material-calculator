import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(join(root, path), "utf8");

test("block metadata declares a dynamic API v3 block", async () => {
  const metadata = JSON.parse(await read("block.json"));
  assert.equal(metadata.apiVersion, 3);
  assert.equal(metadata.name, "yard-material-tools/yard-material-calculator");
  assert.equal(metadata.render, "file:./render.php");
  assert.equal(metadata.attributes.showAttribution.default, false);
});

test("block editor declares every WordPress runtime dependency", async () => {
  const asset = await read("assets/editor.asset.php");
  for (const dependency of ["wp-blocks", "wp-block-editor", "wp-components", "wp-element", "wp-i18n"]) {
    assert.match(asset, new RegExp(`'${dependency}'`));
  }
});

test("plugin renders from one sanitized server-side path", async () => {
  const php = await read("yard-material-calculator.php");
  assert.match(php, /sanitize_text_field/);
  assert.match(php, /sanitize_hex_color/);
  assert.match(php, /esc_attr/);
  assert.match(php, /wp_enqueue_script_module/);
  assert.match(php, /add_shortcode\( 'yard_material_calculator'/);
  assert.doesNotMatch(php, /https?:\/\/.*\.js/);
});

test("dynamic render template writes the escaped calculator markup", async () => {
  const render = await read("render.php");
  assert.match(render, /echo ymc_render_calculator\( \$attributes \)/);
  assert.doesNotMatch(render, /return ymc_render_calculator/);
});

test("bundled widget matches its recorded digest", async () => {
  const widget = await readFile(join(root, "assets/widget.js"));
  const recorded = (await read("assets/widget.sha256")).split(/\s+/)[0];
  assert.equal(createHash("sha256").update(widget).digest("hex"), recorded);
});

test("installable ZIP has one plugin directory and no development files", () => {
  const listing = execFileSync("unzip", ["-Z1", "dist/yard-material-calculator.zip"], {
    cwd: root,
    encoding: "utf8",
  }).trim().split("\n");

  assert.ok(listing.every((path) => path.startsWith("yard-material-calculator/")));
  assert.ok(listing.includes("yard-material-calculator/yard-material-calculator.php"));
  assert.ok(!listing.some((path) => path.includes("node_modules") || path.includes("/test/")));
});

test("Playground Blueprint installs the release and exercises both integrations", async () => {
  const blueprint = JSON.parse(await read("blueprint.json"));
  const serialized = JSON.stringify(blueprint);
  assert.equal(blueprint.steps[0].options.activate, true);
  assert.match(serialized, /releases\/download\/v1\.0\.1\/yard-material-calculator\.zip/);
  assert.match(serialized, /wp:yard-material-tools\/yard-material-calculator/);
  assert.match(serialized, /\[yard_material_calculator/);
});
