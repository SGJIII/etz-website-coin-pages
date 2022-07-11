import { easeInOutQuad } from "../utils/easeInOutQuad";
import { AddEventOrientationChange } from "../utils/addEventOrientationchange";

type TimeoutId = string | number | NodeJS.Timeout | undefined;
class BenefitsSlider {
  static activeSlideIdx = 0;
  static timeSlideWithoutPause = 3000;
  static timeSlideWithPause = 5000;
  static __idSliderInterval: TimeoutId = 0;
  static __idSliderClick: TimeoutId = 0;
  static isLaunchSlider = false;
  static dots: Array<HTMLElement> | null = [];
  static prevIdActiveSlide = 0;
  positon = 0;
  widthSlides: number[] = [];
  slides: NodeListOf<HTMLElement> | null = null;
  dotsContainder: HTMLElement | null = null;
  containder: HTMLElement | null = null;
  activeSlide: HTMLElement | null = null;

  public init() {
    this.createDots();
  }

  static nextSlide() {
    if (!BenefitsSlider.dots) return;
    BenefitsSlider.activeSlideIdx++;
    if (BenefitsSlider.activeSlideIdx > BenefitsSlider.dots.length - 1) {
      BenefitsSlider.activeSlideIdx = 0;
    }
    BenefitsSlider.dots[BenefitsSlider.activeSlideIdx]?.click();
  }

  static launchSlider() {
    BenefitsSlider.isLaunchSlider = true;
    BenefitsSlider.__idSliderInterval = setInterval(() => {
      BenefitsSlider.nextSlide();
    }, BenefitsSlider.timeSlideWithoutPause);
  }

  private createDots() {
    this.slides = document.querySelectorAll<HTMLElement>(
      "[ name-benefits-slide]"
    );

    this.dotsContainder = document.querySelector(
      "[name-benefits-slider-dots-container]"
    );
    this.containder = document.querySelector(
      "[name-benefits-slider-container]"
    );
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
      const dot = document.createElement("span");
      dot.setAttribute("data-status", idx === 0 ? "active" : "idle");
      dot.setAttribute("name-benefits-slider-dot", "");
      dot.className = "BenefitsSection_dot";
      dot.addEventListener("click", () => {
        this.changeActiveSlide(idx);
        clearTimeout(BenefitsSlider.__idSliderInterval);
        clearTimeout(BenefitsSlider.__idSliderClick);
        BenefitsSlider.__idSliderClick = setTimeout(() => {
          BenefitsSlider.launchSlider();
        }, BenefitsSlider.timeSlideWithPause);
      });
      this.dotsContainder?.appendChild(dot);
      BenefitsSlider.dots?.push(dot);
    });

    this.activeSlide = this.slides[0];
  }

  changePosition(step: number, progress = 0) {
    if (this.slides === null) return;

    const widthContainer = this.containder?.getBoundingClientRect()?.width ?? 0;
    const widthSlide =
      this.slides[BenefitsSlider.activeSlideIdx]?.getBoundingClientRect()
        ?.width ?? 0;
    const widthActiveSlide =
      this.activeSlide?.getBoundingClientRect()?.width ?? 0;

    const isRigthDirection =
      BenefitsSlider.prevIdActiveSlide < BenefitsSlider.activeSlideIdx;

    const positionSlide = isRigthDirection
      ? widthContainer + widthSlide
      : -widthContainer - widthSlide;
    const positionActiveSlide = isRigthDirection
      ? widthContainer + widthActiveSlide
      : -widthContainer - widthActiveSlide;

    this.slides.forEach((slide) => {
      if (this.slides === null) return;
      if (
        slide !== this.slides[BenefitsSlider.activeSlideIdx] ||
        slide !== this.activeSlide
      ) {
        slide.setAttribute(
          "style",
          `transform: translateX(${window.innerWidth})`
        );
      }
    });

    this.slides[BenefitsSlider.activeSlideIdx]?.setAttribute(
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

    this.slides[BenefitsSlider.activeSlideIdx]?.setAttribute(
      "style",
      `transform: translateX(${-this.positon}px)`
    );

    this.activeSlide = this.slides[BenefitsSlider.activeSlideIdx];
    BenefitsSlider.prevIdActiveSlide = BenefitsSlider.activeSlideIdx;
  }

  changeActiveSlide(activeIdx: number) {
    BenefitsSlider.activeSlideIdx = activeIdx;
    const step = 1 / 42;
    this.changePosition(step);
    const handleStatus = (el: HTMLElement, idx: number) => {
      el.setAttribute("data-status", idx === activeIdx ? "active" : "idle");
    };
    BenefitsSlider.dots?.forEach(handleStatus);
  }
}

export default BenefitsSlider;
export const launchSlider = BenefitsSlider.launchSlider;
