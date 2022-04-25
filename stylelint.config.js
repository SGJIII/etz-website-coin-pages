const prettierConfig = require("./prettier.config.js");

const titleCase = str => str.replace(/(-|^)([^-]?)/g, (match, _, char) => char.toUpperCase());

const customBemSelector = component => {
  const block = titleCase(component);
  const kebabCase = "[a-z][a-zA-Z0-9]*";
  const element = `(?:_${kebabCase})?`;
  const modifier = `(?:__${kebabCase})?`;
  const attribute = "(?:\\[.+\\])?";
  return new RegExp(`^\\.${block}${element}${modifier}${attribute}$`);
};

module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-css-modules", "stylelint-config-prettier"],
  plugins: ["stylelint-prettier", "stylelint-selector-bem-pattern"],
  rules: {
    "selector-class-pattern": null,
    "prettier/prettier": [true, prettierConfig],
    "plugin/selector-bem-pattern": {
      implicitComponents: true,
      preset: "bem",
      componentSelectors: {
        initial: customBemSelector,
      },
      ignoreCustomProperties: ".*",
    },
  },
};