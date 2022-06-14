/* eslint-disable @typescript-eslint/ban-ts-comment */
import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import SupportedCrypto from "./supported-crypto/supported-crypto-search";
import "./three";
import "universalsmoothscroll";
import ContactFrom from "./contact";
import Notification from "./notification";
import BenefitsSlider from "./benefits-slider";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    new Notification();
    const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
    const accordion = new Accordion();
    const supportedCrypto = new SupportedCrypto({
      nameContainer: "[data-name=SupportedCryptoTable]",
      nameSearch: "[data-name=SupportedCryptoSearchInput]",
      namePagination: "[data-name=SupportedCryptoPagination]",
    });
    const benefitsSlider = new BenefitsSlider();
    const contactFrom = new ContactFrom();

    headerMenu.init();
    accordion.init();
    supportedCrypto.init().render();
    contactFrom.init();
    benefitsSlider.init();

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

    //@ts-ignore
    uss.setPageScroller(document.body);
    //@ts-ignore
    uss.hrefSetup();
    //@ts-ignore
    // window.addEventListener("wheel", () => uss.stopScrolling());
  },
  false
);
