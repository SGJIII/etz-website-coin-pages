import { easeInOutQuad } from "../utils/easeInOutQuad";
import BodyWatcher from "../utils/bodyWatcher";
import { checkTouchEvent } from "../utils/typeGuards";
import { AddEventOrientationChange } from "../utils/addEventOrientationchange";

type TimeoutId = string | number | NodeJS.Timeout | undefined;
class BenefitsSlider extends BodyWatcher<HTMLElement> {
  activeSlideIdx = 0;
  deltaY = 0;
  positon = 0;
  prevPosition = 0;
  widthSlides: number[] = [];
  dots: Array<HTMLElement> | null = [];
  dotsContainder: HTMLElement | null = null;
  containder: HTMLElement | null = null;
  timeSlideWithoutPause = 2000;
  timeSlideWithPause = 5000;
  timeSlide = this.timeSlideWithoutPause;
  __scrollId: TimeoutId = 0;
  __firstScrollId: TimeoutId = 0;
  __idScrollMotion: TimeoutId = 0;
  __idNextSlide: TimeoutId = 0;
  isLaunchNextSlide = false;
  isScrollMotion = false;
  isScrolling = false;
  isFirstSlideSwitch = true;
  isDisabledScroll = false;
  isScrollingOnLink = false;
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
    const links = document.querySelectorAll("[name-link]");
    links.forEach((link) => {
      link?.addEventListener("click", () => {
        this.isScrollingOnLink = true;
      });
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

      document.addEventListener("scroll", () => {
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

    super.scrollBodyEnable(this.deltaY);
  }

  public scrollBodyDisable(): void {
    if (this.isDisabledScroll === true) return;
    super.scrollBodyDisable(this.initialOffset.top);
    this.isDisabledScroll = true;
    this.__firstScrollId = setTimeout(() => {
      this.scrollBodyEnable();
    }, 1000);
    window.scrollTo({
      top: this.initialOffset.top,
      behavior: "smooth",
    });
  }
  private watchPositionScroll() {
    if (this.deltaY < 0 || this.isScrollMotion) {
      if (
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
    } else if (this.deltaY > 0 || this.isScrollMotion) {
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
    const play = this.element?.getAttribute("data-play");
    if (this.isLaunchNextSlide === false && play) {
      this.isLaunchNextSlide = true;
      clearTimeout(this.__idNextSlide);
      this.__idNextSlide = setTimeout(() => {
        this.nextSlide();
        this.isLaunchNextSlide = false;
        this.timeSlide = this.timeSlideWithoutPause;
      }, this.timeSlide);
    }
    requestAnimationFrame(() => {
      this.watchPositionScroll();
    });
  }

  private createDots() {
    const slides = this.querySelectorAll("[ name-benefits-slide]");
    this.dotsContainder = this.querySelector(
      "[name-benefits-slider-dots-container]"
    );
    this.containder = this.querySelector("[name-benefits-slider-container]");
    slides.forEach((slide, idx) => {
      const width = slide.getBoundingClientRect().width;
      this.widthSlides.push(width);
      const dot = this.createElement("span");
      dot.setAttribute("data-status", idx === 0 ? "active" : "idle");
      dot.setAttribute("name-benefits-slider-dot", "");
      dot.className = "BenefitsSection_dot";
      dot.addEventListener("click", () => {
        clearTimeout(this.__idNextSlide);
        this.timeSlide = this.timeSlideWithPause;
        this.isLaunchNextSlide = false;
        this.changeActiveSlide(idx);
      });
      this.dotsContainder?.appendChild(dot);
      this.dots?.push(dot);
    });
  }

  private calcPosition(idx: number) {
    let newPositon = 0;
    let i = 1;
    for (const width of this.widthSlides) {
      if (i > idx) break;
      newPositon += width;
      i++;
    }
    this.positon = newPositon;
    return newPositon;
  }

  changePosition(step: number, progress = 0) {
    progress += step;

    this.containder?.setAttribute(
      "style",
      `transform: translateX(${-(
        this.prevPosition +
        (this.positon - this.prevPosition) * easeInOutQuad(progress)
      )}px)`
    );

    if (progress < 1) {
      requestAnimationFrame(() => this.changePosition(step, progress));
      return;
    }
    this.prevPosition = this.positon;
    this.containder?.setAttribute(
      "style",
      `transform: translateX(${-this.positon}px)`
    );
  }

  changeActiveSlide(activeIdx: number) {
    const step = 1 / 42;
    this.calcPosition(activeIdx);
    this.changePosition(step);
    const handleStatus = (el: HTMLElement, idx: number) => {
      el.setAttribute("data-status", idx === activeIdx ? "active" : "idle");
    };
    this.dots?.forEach(handleStatus);
    this.activeSlideIdx = activeIdx;
  }
}

const benefitsSlider = new BenefitsSlider("[name-benefits-section]");
benefitsSlider.init();

export default BenefitsSlider;
