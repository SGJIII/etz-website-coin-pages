import Accordion from "./accordion";
import HeaderMenu from "./header-menu";
import SmoothScroll from "./smooth-scroll";
import "./three";
import Butter from "./butter";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
    const smoothScroll = new SmoothScroll();
    const accordion = new Accordion();

    headerMenu.init();
    smoothScroll.init();
    accordion.init();

    const butter = new Butter();
    // butter.init();
  },
  false
);
