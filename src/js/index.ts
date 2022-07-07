/* eslint-disable @typescript-eslint/ban-ts-comment */
import Accordion from "./accordion";
import BenefitsSlider from "./benefits-slider/newVersion";
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
