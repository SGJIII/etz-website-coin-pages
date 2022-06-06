/* eslint-disable @typescript-eslint/ban-ts-comment */
import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import SupportedCrypto from "./supported-crypto/supported-crypto-search";
import "./three";
import "universalsmoothscroll";
import ContactFrom from "./contact";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
    const accordion = new Accordion();
    const supportedCrypto = new SupportedCrypto({
      nameContainer: "[data-name=SupportedCryptoTable]",
      nameSearch: "[data-name=SupportedCryptoSearchInput]",
      namePagination: "[data-name=SupportedCryptoPagination]",
    });

    const contactFrom = new ContactFrom();

    headerMenu.init();
    accordion.init();
    supportedCrypto.init().render();
    contactFrom.init();

    //@ts-ignore
    uss.setPageScroller(document.body);
    //@ts-ignore
    uss.hrefSetup();
    //@ts-ignore
    window.addEventListener("wheel", () => uss.stopScrolling());
  },
  false
);
