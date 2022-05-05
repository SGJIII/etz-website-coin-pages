import HeaderMenu from "./header-menu";
import SmoothScroll from "./smooth-scroll";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const headerMenu = new HeaderMenu();
    const smoothScroll = new SmoothScroll();

    headerMenu.init();
    smoothScroll.init();
  },
  false
);
