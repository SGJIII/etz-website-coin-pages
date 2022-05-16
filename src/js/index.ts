import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import SmoothScroll from "./smooth-scroll";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu();
    const smoothScroll = new SmoothScroll();
    const accordion = new Accordion();

    headerMenu.init();
    smoothScroll.init();
    accordion.init();
  },
  false
);
