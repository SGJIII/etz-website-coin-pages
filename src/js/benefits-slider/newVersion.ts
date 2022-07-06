import { easeInOutQuad } from "../utils/easeInOutQuad";
import BodyWatcher from "../utils/bodyWatcher";
import { checkTouchEvent } from "../utils/typeGuards";
import { AddEventOrientationChange } from "../utils/addEventOrientationchange";
import { addLinkClickCallback } from "../links/links";

type TimeoutId = string | number | NodeJS.Timeout | undefined;
class BenefitsSlider extends BodyWatcher<HTMLElement> {
  activeSlideIdx = 0;
  deltaY = 0;
  positon = 0;
  prevPosition = 0;
  widthSlides: number[] = [];
  dots: Array<HTMLElement> | null = [];
  slides: NodeListOf<HTMLElement> | null = null;
  dotsContainder: HTMLElement | null = null;
  containder: HTMLElement | null = null;
  timeSlideWithoutPause = 3000;
  timeSlideWithPause = 5000;
  __firstScrollId: TimeoutId = 0;
  __idScrollMotion: TimeoutId = 0;
  __idSliderInterval: TimeoutId = 0;
  isScrollMotion = false;
  isScrolling = false;
  isFirstSlideSwitch = true;
  isDisabledScroll = false;
  isScrollingOnLink = false;
  isStartSlide = false;
  isLaunchSlider = false;
  activeSlide: HTMLElement | null = null;

  constructor(props: string) {
    super(props);
  }

  public init() {
    this.setDefaultPositionCanvas();
    this.createDots();
    this.watchScrolling();
    this.watchPositionScroll();
    this.watchWindowResize();
    this.watchWindowOrientation();
    this.setCustomBehavierLink();
  }

  private setCustomBehavierLink() {
    addLinkClickCallback(() => {
      this.isScrollingOnLink = true;
    });
  }

  private setDefaultPositionCanvas() {
    const description = document
      .querySelector("[ name-header-section-description]")
      ?.getBoundingClientRect();

    const phoneBlock = document.querySelector(".webgl");
    if (description) {
      phoneBlock?.setAttribute(
        "data-start-position",
        String(this.pageOffset.top + description.top - description?.height + 40)
      );
    }
  }

  private watchWindowResize() {
    window.addEventListener("resize", () => {
      this.setDefaultPositionCanvas();
    });
  }

  private watchWindowOrientation() {
    AddEventOrientationChange(() => {
      this.scrollBodyEnable();
      this.setDefaultPositionCanvas();
    });
  }

  private watchScrolling() {
    if (this.isTouchDevice) {
      const addTouchEvent = <T extends Document | HTMLElement | null>(
        element: T,
        fn?: () => void
      ) => {
        if (element === null) return;

        let event: TouchEvent | null = null;
        element.addEventListener(
          "touchstart",
          (e) => {
            checkTouchEvent(e);
            event = e;
            this.isScrolling = false;
          },
          { passive: false }
        );
        element.addEventListener(
          "touchmove",
          (e) => {
            checkTouchEvent(e);
            if (event) {
              this.deltaY = event.touches[0].pageY - e.touches[0].pageY;
            }

            if (fn) fn();
          },
          { passive: false }
        );
      };

      window.addEventListener("scroll", () => {
        this.isScrollMotion = true;
        clearTimeout(this.__idScrollMotion);

        this.__idScrollMotion = setTimeout(() => {
          this.isScrollMotion = false;
          this.isScrollingOnLink = false;
        }, 500);
      });

      addTouchEvent(document);
    } else {
      let __idDelta: string | number | NodeJS.Timeout | undefined = 0;
      let isFisrtWheel = false;
      window.addEventListener("wheel", (e) => {
        isFisrtWheel = true;
        this.deltaY = e.deltaY;

        clearTimeout(__idDelta);
        __idDelta = setTimeout(() => {
          this.deltaY = 0;
        }, 30);

        if (this.isScrolling === false && isFisrtWheel === true) {
          this.isScrolling = true;
          setTimeout(() => {
            this.isScrolling = false;
            isFisrtWheel = false;
          }, 1000);
        }
      });
      window.addEventListener("scroll", () => {
        this.isScrollMotion = true;
        clearTimeout(this.__idScrollMotion);

        this.__idScrollMotion = setTimeout(() => {
          this.isScrollMotion = false;
          this.isScrollingOnLink = false;
        }, 500);
      });
    }
  }

  get isTopLineInside() {
    return (
      this.pageOffset.top > this.initialOffset.top &&
      this.pageOffset.top <= this.initialOffset.bottom
    );
  }

  get isTopLineUnder() {
    return this.pageOffset.top > this.initialOffset.top;
  }

  get isTopLineOver() {
    return this.pageOffset.top < this.initialOffset.top;
  }

  get isBottomLineInside() {
    return (
      this.pageOffset.top + this.height < this.initialOffset.bottom &&
      this.pageOffset.top + this.height > this.initialOffset.top &&
      this.pageOffset.top < this.initialOffset.top
    );
  }
  get isLastSlideActive() {
    return this.activeSlideIdx === (this.dots?.length ?? 0) - 1;
  }

  get isFirstSlideActive() {
    return this.activeSlideIdx === 0;
  }

  get isTouchDevice() {
    return "ontouchstart" in window;
  }

  private nextSlide() {
    if (!this.dots) return;
    this.activeSlideIdx++;
    if (this.activeSlideIdx > this.dots.length - 1) {
      this.activeSlideIdx = 0;
    }
    this.dots[this.activeSlideIdx]?.click();
  }

  public scrollBodyEnable(): void {
    if (this.isDisabledScroll === false) return;
    this.isDisabledScroll = false;
    clearTimeout(this.__firstScrollId);
    this.deltaY = 0;

    super.scrollBodyEnable();
  }

  public scrollBodyDisable(): void {
    if (this.isDisabledScroll === true) return;
    super.scrollBodyDisable();
    this.isDisabledScroll = true;
    this.__firstScrollId = setTimeout(() => {
      this.scrollBodyEnable();
    }, 1000);
    window.scrollTo({
      top: this.initialOffset.top,
      behavior: "smooth",
    });
    this.isStartSlide = true;
  }

  prevTop = 0;
  deltaYPage = 0;
  private watchPositionScroll() {
    if (this.isScrollMotion) {
      this.deltaYPage = this.prevTop - this.pageOffset.top;
      this.prevTop = this.pageOffset.top;
    } else {
      this.deltaYPage = 0;
    }

    if (this.deltaYPage > 0 || this.deltaY < 0) {
      if (
        !this.isScrollingOnLink &&
        this.pageOffset.top < this.initialOffset.top &&
        this.pageOffset.top + this.height > this.initialOffset.top &&
        this.pageOffset.top + this.height < this.initialOffset.bottom &&
        this.isFirstSlideSwitch
      ) {
        this.isFirstSlideSwitch = false;
        this.scrollBodyDisable();
      }

      if (this.pageOffset.top + this.height <= this.initialOffset.top) {
        this.isFirstSlideSwitch = true;
      }
    } else if (this.deltaYPage < 0 || this.deltaY > 0) {
      if (
        !this.isScrollingOnLink &&
        this.isTopLineUnder &&
        this.pageOffset.top < this.initialOffset.bottom &&
        this.isFirstSlideSwitch
      ) {
        this.isFirstSlideSwitch = false;
        this.scrollBodyDisable();
      }

      if (this.pageOffset.top > this.initialOffset.bottom) {
        this.isFirstSlideSwitch = true;
      }
    }
    const isPlay = this.element?.getAttribute("data-play");
    if ((this.isStartSlide || isPlay) && !this.isLaunchSlider) {
      this.launchSlider();
      return;
    }
    requestAnimationFrame(() => {
      this.watchPositionScroll();
    });
  }

  launchSlider() {
    this.isLaunchSlider = true;
    this.__idSliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.timeSlideWithoutPause);
  }

  private createDots() {
    this.slides = this.querySelectorAll<HTMLElement>("[ name-benefits-slide]");

    this.dotsContainder = this.querySelector(
      "[name-benefits-slider-dots-container]"
    );
    this.containder = this.querySelector("[name-benefits-slider-container]");
    const calculateWidthDots = (slide: HTMLElement) => {
      const width = slide.getBoundingClientRect().width;
      this.widthSlides.push(width);
    };

    AddEventOrientationChange(() => {
      this.widthSlides = [];
      this.slides?.forEach((slide) => {
        calculateWidthDots(slide);
      });
    });
    this.slides.forEach((slide, idx) => {
      calculateWidthDots(slide);
      const dot = this.createElement("span");
      dot.setAttribute("data-status", idx === 0 ? "active" : "idle");
      dot.setAttribute("name-benefits-slider-dot", "");
      dot.className = "BenefitsSection_dot";
      dot.addEventListener("click", () => {
        this.changeActiveSlide(idx);
        clearTimeout(this.__idSliderInterval);
        setTimeout(() => {
          this.launchSlider();
        }, this.timeSlideWithPause);
      });
      this.dotsContainder?.appendChild(dot);
      this.dots?.push(dot);
    });

    this.activeSlide = this.slides[0];
  }

  changePosition(step: number, progress = 0) {
    if (this.slides === null) return;

    const widthContainer = this.containder?.getBoundingClientRect()?.width ?? 0;
    const widthSlide =
      this.slides[this.activeSlideIdx]?.getBoundingClientRect()?.width ?? 0;
    const widthActiveSlide =
      this.activeSlide?.getBoundingClientRect()?.width ?? 0;

    const positionSlide = widthContainer + widthSlide;
    const positionActiveSlide = widthContainer + widthActiveSlide;

    this.slides[this.activeSlideIdx]?.setAttribute(
      "style",
      `transform: translateX(${
        positionSlide - positionSlide * easeInOutQuad(progress)
      }px)`
    );
    this.activeSlide?.setAttribute(
      "style",
      `transform: translateX(${-(
        0 +
        positionActiveSlide * easeInOutQuad(progress)
      )}px)`
    );

    progress += step;
    if (progress < 1) {
      requestAnimationFrame(() => this.changePosition(step, progress));
      return;
    }

    this.slides[this.activeSlideIdx]?.setAttribute(
      "style",
      `transform: translateX(${-this.positon}px)`
    );
    this.activeSlide = this.slides[this.activeSlideIdx];
  }

  changeActiveSlide(activeIdx: number) {
    this.activeSlideIdx = activeIdx;
    const step = 1 / 42;
    this.changePosition(step);
    const handleStatus = (el: HTMLElement, idx: number) => {
      el.setAttribute("data-status", idx === activeIdx ? "active" : "idle");
    };
    this.dots?.forEach(handleStatus);
  }
}

const benefitsSlider = new BenefitsSlider("[name-benefits-section]");
benefitsSlider.init();

export default BenefitsSlider;
