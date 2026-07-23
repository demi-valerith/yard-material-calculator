(function (blocks, blockEditor, components, element, i18n) {
  const el = element.createElement;
  const InspectorControls = blockEditor.InspectorControls;
  const PanelBody = components.PanelBody;
  const SelectControl = components.SelectControl;
  const TextControl = components.TextControl;
  const ToggleControl = components.ToggleControl;
  const __ = i18n.__;

  const materials = [
    "Pea gravel",
    "Crushed stone",
    "River rock",
    "Topsoil",
    "Compost",
    "Mulch",
    "Sand",
    "Fill dirt",
  ];

  blocks.registerBlockType("yard-material-tools/yard-material-calculator", {
    edit: function ({ attributes, setAttributes }) {
      const areaUnit = attributes.unit === "metric" ? "m\u00B2" : "sq ft";
      const depthUnit = attributes.unit === "metric" ? "cm" : "in";
      const selectedMaterials = attributes.materials.split(",").map(function (value) {
        return value.trim();
      });

      return el(
        element.Fragment,
        {},
        el(
          InspectorControls,
          {},
          el(
            PanelBody,
            { title: __("Calculator settings", "yard-material-calculator"), initialOpen: true },
            el(SelectControl, {
              label: __("Default material", "yard-material-calculator"),
              value: attributes.material,
              options: selectedMaterials.map(function (name) {
                return { label: name, value: name };
              }),
              onChange: function (value) {
                setAttributes({ material: value });
              },
            }),
            el(SelectControl, {
              label: __("Units", "yard-material-calculator"),
              value: attributes.unit,
              options: [
                { label: __("Imperial", "yard-material-calculator"), value: "imperial" },
                { label: __("Metric", "yard-material-calculator"), value: "metric" },
              ],
              onChange: function (value) {
                setAttributes({ unit: value });
              },
            }),
            el(TextControl, {
              label: __("Area", "yard-material-calculator"),
              type: "number",
              min: 0.01,
              value: attributes.area,
              help: areaUnit,
              onChange: function (value) {
                setAttributes({ area: Number(value) || 0.01 });
              },
            }),
            el(TextControl, {
              label: __("Depth", "yard-material-calculator"),
              type: "number",
              min: 0.01,
              value: attributes.depth,
              help: depthUnit,
              onChange: function (value) {
                setAttributes({ depth: Number(value) || 0.01 });
              },
            }),
            el(TextControl, {
              label: __("Accent color", "yard-material-calculator"),
              value: attributes.accent,
              help: __("# followed by six hexadecimal digits", "yard-material-calculator"),
              onChange: function (value) {
                setAttributes({ accent: value });
              },
            }),
            el(ToggleControl, {
              label: __("Show source attribution", "yard-material-calculator"),
              checked: attributes.showAttribution,
              onChange: function (value) {
                setAttributes({ showAttribution: value });
              },
            })
          ),
          el(
            PanelBody,
            { title: __("Available materials", "yard-material-calculator"), initialOpen: false },
            materials.map(function (name) {
              const checked = selectedMaterials.includes(name);
              return el(ToggleControl, {
                key: name,
                label: name,
                checked: checked,
                onChange: function (value) {
                  let next = value
                    ? selectedMaterials.concat(name)
                    : selectedMaterials.filter(function (candidate) {
                        return candidate !== name;
                      });
                  if (next.length === 0) next = [name];
                  setAttributes({
                    materials: materials.filter(function (candidate) {
                      return next.includes(candidate);
                    }).join(","),
                    material: next.includes(attributes.material) ? attributes.material : next[0],
                  });
                },
              });
            })
          )
        ),
        el(
          "div",
          { className: "ymc-editor-preview", style: { borderLeftColor: attributes.accent } },
          el("p", { className: "ymc-editor-kicker" }, __("Planning estimate", "yard-material-calculator")),
          el("h3", {}, __("Yard material coverage", "yard-material-calculator")),
          el("dl", {},
            el("div", {}, el("dt", {}, __("Material", "yard-material-calculator")), el("dd", {}, attributes.material)),
            el("div", {}, el("dt", {}, __("Area", "yard-material-calculator")), el("dd", {}, attributes.area + " " + areaUnit)),
            el("div", {}, el("dt", {}, __("Depth", "yard-material-calculator")), el("dd", {}, attributes.depth + " " + depthUnit))
          ),
          el("p", { className: "ymc-editor-note" }, __("Interactive calculation appears on the published page.", "yard-material-calculator"))
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
