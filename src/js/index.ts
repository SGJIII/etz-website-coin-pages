/* eslint-disable @typescript-eslint/ban-ts-comment */
import Accordion from "./accordion";
import BenefitsSlider from "./benefits-slider";
// import SupportedCrypto from "./supported-crypto/supported-crypto-search";
import ContactFrom from "./contact";
import Notification from "./notification";

const benefitsSlider = new BenefitsSlider();
new Notification();
const accordion = new Accordion();
// const supportedCrypto = new SupportedCrypto({
//   nameContainer: "[data-name=SupportedCryptoTable]",
//   nameSearch: "[data-name=SupportedCryptoSearchInput]",
//   namePagination: "[data-name=SupportedCryptoPagination]",
// });
const contactFrom = new ContactFrom();

benefitsSlider.init();
accordion.init();
// supportedCrypto.init().render();
contactFrom.init();

const sec = document.querySelector<HTMLDivElement>(".EtzMobileSection");

window?.addEventListener("scroll", () => {
  function animation_loop() {
    const current_offset = window.pageYOffset;
    const object__offset = sec?.offsetTop ?? 0;
    const object__height = sec?.getBoundingClientRect().height ?? 0;
    if (
      current_offset < object__offset + object__height &&
      current_offset > object__offset - object__height
    ) {
      sec?.setAttribute(
        "style",
        `--coin-position: ${(current_offset - object__offset) / 7}px`
      );
    }
  }
  const etzSection = document.querySelector<HTMLElement>(
    "[name-etz-mobile-section]"
  );

  if (
    (etzSection?.getBoundingClientRect()?.top ?? 0) <= 0 &&
    (etzSection?.getBoundingClientRect()?.bottom ?? 0) >= 0
  ) {
    requestAnimationFrame(animation_loop);
  }
});

// Global boolean variable that holds the current orientation
let pageInPortraitMode: boolean;

// Listen for window resizes to detect orientation changes
window.addEventListener("resize", windowSizeChanged);

// Set the global orientation variable as soon as the page loads
addEventListener("load", function () {
  pageInPortraitMode = window.innerHeight > window.innerWidth;
  document
    .getElementById("viewport")
    ?.setAttribute(
      "content",
      "width=" +
        window.innerWidth +
        ", height=" +
        window.innerHeight +
        ", initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    );
});

// Adjust viewport values only if orientation has changed (not on every window resize)
function windowSizeChanged() {
  if (
    (pageInPortraitMode === true && window.innerHeight < window.innerWidth) ||
    (pageInPortraitMode === false && window.innerHeight > window.innerWidth)
  ) {
    pageInPortraitMode = window.innerHeight > window.innerWidth;
    document
      .getElementById("viewport")
      ?.setAttribute(
        "content",
        "width=" +
          window.innerWidth +
          ", height=" +
          window.innerHeight +
          ", initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      );
  }
}
