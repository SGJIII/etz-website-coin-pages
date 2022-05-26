import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import "./three";
import "universalsmoothscroll";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
    const accordion = new Accordion();

    headerMenu.init();
    accordion.init();

    uss.setPageScroller(document.body);
    uss.hrefSetup();

    window.addEventListener("wheel", () => uss.stopScrolling());
  },
  false
);
