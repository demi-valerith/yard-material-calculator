=== Demi Yard Material Calculator ===
Contributors: demi1
Tags: calculator, landscaping, gravel, mulch, blocks
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add an imperial or metric yard material coverage calculator with a Gutenberg block or shortcode.

== Description ==

Demi Yard Material Calculator estimates cubic yards or cubic meters and a typical
weight range for gravel, stone, topsoil, compost, mulch, sand, and fill dirt.

The calculator is available as a dynamic Gutenberg block and as the
`[yard_material_calculator]` shortcode. The bundled calculator runs in the
visitor's browser without cookies, analytics, storage, or background requests.

Public source attribution is disabled by default and can be enabled by the site
owner. Results are planning estimates only. Moisture, compaction, gradation, and
supplier measurements vary.

== Installation ==

1. Upload the plugin directory to `/wp-content/plugins/` or install the ZIP.
2. Activate Demi Yard Material Calculator.
3. Add the Demi Yard Material Calculator block, or use `[yard_material_calculator]`.

Example:

`[yard_material_calculator material="Pea gravel" area="500" depth="3" unit="imperial" accent="#ab4c29" attribution="false"]`

== Frequently Asked Questions ==

= Does the plugin contact another server? =

No. The calculator script and material data are bundled in the plugin. If the
site owner enables source attribution, a visitor can choose to follow that link.

= Are the results a quote? =

No. Results are planning estimates. Confirm density, delivery quantities, and
local conditions with the material supplier.

= Which units are supported? =

Imperial mode uses square feet, inches, cubic yards, and short tons. Metric mode
uses square meters, centimeters, cubic meters, and metric tonnes.

== Changelog ==

= 1.0.2 =

* Adopt a distinctive WordPress.org plugin name and slug.

= 1.0.1 =

* Fix front-end rendering of the dynamic Gutenberg block.

= 1.0.0 =

* Add a dynamic Gutenberg block and shortcode.
* Add imperial and metric units.
* Add material filtering, default values, accent color, and optional attribution.
