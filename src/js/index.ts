/* eslint-disable @typescript-eslint/ban-ts-comment */
import Accordion from "./accordion";
import SupportedCrypto from "./supported-crypto/supported-crypto-search";
import ContactFrom from "./contact";
import Notification from "./notification";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    new Notification();
    const accordion = new Accordion();
    const supportedCrypto = new SupportedCrypto({
      nameContainer: "[data-name=SupportedCryptoTable]",
      nameSearch: "[data-name=SupportedCryptoSearchInput]",
      namePagination: "[data-name=SupportedCryptoPagination]",
    });
    const contactFrom = new ContactFrom();

    accordion.init();
    supportedCrypto.init().render();
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
      requestAnimationFrame(animation_loop);
    });
  },
  false
);

window.addEventListener("wheel", (e) => {
  //@ts-ignore
  uss.stopScrollingAll(document.body);
});
//@ts-ignore
uss.setPageScroller(document.body);
//@ts-ignore
uss.hrefSetup();

const links = document.querySelectorAll("[name-link]");
links.forEach((link) => {
  const href = link.getAttribute("href");
  const element = href ? document.querySelector(href) : null;
  const body = document.body.getBoundingClientRect();
  const rect = element?.getBoundingClientRect();
  const heightMenu = 106;
  const sectionWithoutMargin = ["#etz-mobile", "#contact-us"];
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const marginBottomMenu =
      href && sectionWithoutMargin.includes(href) ? 0 : 64;
    const position =
      Math.abs((rect?.top ?? 0) - body.top) - heightMenu - marginBottomMenu;
    uss.scrollYTo(position, window);
  });
});
