import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import SupportedCrypto from "./supported-crypto";
import "./three";
import "universalsmoothscroll";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
    const accordion = new Accordion();
    const supportedCrypto = new SupportedCrypto(
      "[data-name=SupportedCryptoTable]"
    );

    headerMenu.init();
    accordion.init();
    supportedCrypto.init();

    uss.setPageScroller(document.body);
    uss.hrefSetup();

    window.addEventListener("wheel", () => uss.stopScrolling());
  },
  false
);
