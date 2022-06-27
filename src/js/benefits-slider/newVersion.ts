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

  __scrollId: TimeoutId = 0;
  __firstScrollId: TimeoutId = 0;
  __idScrollMotion: TimeoutId = 0;
  isScrollMotion = false;
  isScrolling = false;
  isFirstSlideSwitch = true;
  isDisabledScroll = false;

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
        }, 500);
      });

      addTouchEvent(document);
      addTouchEvent(this.element, () => {
        this.handleSlideMobile();
      });
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

  private handleSlideDesktop() {
    if (
      this.isScrolling === false &&
      this.isFirstSlideSwitch === false &&
      this.isTouchDevice === false
    ) {
      this.nextSlide();
    }
  }

  private handleSlideMobile() {
    if (
      this.isScrolling === false &&
      this.isFirstSlideSwitch === false &&
      this.isTouchDevice === true
    ) {
      this.isScrolling = true;
      this.nextSlide();
    }
  }

  private nextSlide() {
    clearTimeout(this.__scrollId);
    this.__scrollId = setTimeout(() => {
      if (!this.dots || this.deltaY === 0) return;

      if (this.deltaY < 0) {
        if (this.isFirstSlideActive) {
          return this.scrollBodyEnable();
        }
        this.activeSlideIdx--;
        this.dots[this.activeSlideIdx]?.click();
      } else if (this.deltaY > 0) {
        if (this.isLastSlideActive) {
          return this.scrollBodyEnable();
        }

        this.activeSlideIdx++;
        this.dots[this.activeSlideIdx]?.click();
      }
    }, 300);
  }

  public scrollBodyEnable(): void {
    if (this.isDisabledScroll === false) return;
    this.isDisabledScroll = false;
    clearTimeout(this.__firstScrollId);
    this.isFirstSlideSwitch = true;
    this.deltaY = 0;

    super.scrollBodyEnable(this.deltaY);
  }

  public scrollBodyDisable(): void {
    if (this.isDisabledScroll === true) return;
    super.scrollBodyDisable(this.initialOffset.top);
    this.isDisabledScroll = true;
    this.__firstScrollId = setTimeout(() => {
      this.isFirstSlideSwitch = false;
    }, 1000);
    window.scrollTo({
      top: this.initialOffset.top,
      behavior: "smooth",
    });
  }

  private watchPositionScroll() {
    if (
      (this.deltaY < 0 || this.isScrollMotion) &&
      this.isTopLineOver &&
      this.isBottomLineInside &&
      !this.isFirstSlideActive
    ) {
      this.scrollBodyDisable();
    } else if (
      (this.deltaY > 0 || this.isScrollMotion) &&
      this.isTopLineUnder &&
      !this.isLastSlideActive
    ) {
      this.scrollBodyDisable();
    }

    this.handleSlideDesktop();

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
