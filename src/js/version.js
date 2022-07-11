/* eslint-disable no-console */
import config from "../../package.json";

console.group("App info:");

window.version = config.version;
if (process.env.BIULD_STATUS === undefined) {
  window.version = "NOT FOR TESTING";
}

if (process.env.BIULD_STATUS !== "PRODUCTION") {
  const label = document.createElement("span");
  label.innerText = window.version;
  label.classList.add("version");

  if (process.env.BIULD_STATUS === undefined) {
    label.classList.add("version__highlight");
  }
  document.body.appendChild(label);
}

console.log("Build version: " + window.version);

console.groupEnd();
