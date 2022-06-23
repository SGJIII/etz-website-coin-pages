import { getDataName } from "../utils/getDataName";
import { createElement } from "../utils/createElement";
import { wheelOpt } from "../utils/scroll";

class BenefitsSlider {
  elementContainder: HTMLDivElement | null = null;
  elementSlide: NodeListOf<HTMLDivElement> | null = null;
  elementDotsContainder: HTMLDivElement | null = null;
  elementDot: Array<HTMLElement> | null = [];
  section: HTMLDivElement | null = null;
  event: WheelEvent | null = null;

  widthSlides: number[] = [];
  positon = 0;
  currentPosition = 0;
  activeElement = 0;
  __scrollId: string | number | NodeJS.Timeout | undefined;
  offSetTopSection = 0;
  deltaY = 0;
  deltaY2 = 0;

  isDisabledScroll = false;
  isFirst = true;
  isScrolling = false;
  isOutside = true;

  constructor() {
    this.elementContainder = document.querySelector<HTMLDivElement>(
      getDataName("BenefitsSliderContainer")
    );
    this.elementSlide = document.querySelectorAll<HTMLDivElement>(
      getDataName("BenefitsSliderSlide")
    );
    this.elementDotsContainder = document.querySelector<HTMLDivElement>(
      getDataName("BenefitsSliderDots")
    );
    this.section = document.querySelector<HTMLDivElement>(".BenefitsSection");
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
  prevPos = 0;
  turnActive(idx: number) {
    if (this.elementDot === null) return;
    this.calcPosition(idx);
    function easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    const step = 1 / 42;
    let progress = 0;
    const changePosition = () => {
      this.elementContainder?.setAttribute(
        "style",
        `transform: translateX(${-(
          this.prevPos +
          (this.positon - this.prevPos) * easeInOutQuad(progress)
        )}px)`
      );

      progress += step;
      if (progress < 1) {
        requestAnimationFrame(changePosition);
      } else {
        // this.currentPosition = this.positon;
        this.prevPos = this.positon;
        this.elementContainder?.setAttribute(
          "style",
          `transform: translateX(${-this.positon}px)`
        );
      }
    };
    changePosition();

    this.elementDot.forEach((el) => {
      el.classList.remove("BenefitsSection_dot__active");
    });
    this.elementDot[idx].classList.add("BenefitsSection_dot__active");
    this.activeElement = idx;
  }

  private createDots() {
    this.elementSlide?.forEach((el, idx) => {
      this.widthSlides.push(el.getBoundingClientRect().width);
      const dot = createElement("span");
      dot.className =
        idx === 0
          ? "BenefitsSection_dot BenefitsSection_dot__active"
          : "BenefitsSection_dot";

      dot.setAttribute("data-name", "BenefitsSliderDot");
      dot.addEventListener("click", () => {
        this.turnActive(idx);
      });

      this.elementDotsContainder?.appendChild(dot);
      this.elementDot?.push(dot);
    });
  }

  private nextSlide() {
    if (this.section === null || this.elementDot === null) return;

    if (this.deltaY < 0) {
      if (this.activeElement === 0) {
        this.scrollTurnOn();
      }
      if (this.activeElement > 0) {
        this.activeElement--;
        this.elementDot[this.activeElement]?.click();
      }
    } else if (this.deltaY > 0) {
      if (this.activeElement === this.elementDot?.length - 1) {
        this.scrollTurnOn();
      }

      if (this.activeElement < this.elementDot?.length - 1) {
        this.activeElement++;
        this.elementDot[this.activeElement]?.click();
      }
    }
  }

  __idFirstInput = 0;

  private slideSwitcher() {
    if (
      this.isDisabledScroll === false ||
      this.isFirst === true ||
      this.isScrolling === true
    )
      return false;

    this.isScrolling = true;
    if (window.innerWidth < 768) {
      clearTimeout(this.__scrollId);
      this.__scrollId = setTimeout(() => {
        this.nextSlide();

        this.isScrolling = false;
      }, 300);
    } else {
      clearTimeout(this.__scrollId);
      this.__scrollId = setTimeout(() => {
        this.nextSlide();

        setTimeout(() => {
          this.isScrolling = false;
        }, 1000);
      }, 300);
    }

    return true;
  }

  private scrollTurnOff(_name?: string) {
    const rect = this.section?.getBoundingClientRect();
    const rectBody = document.body.getBoundingClientRect();

    const mouseWheelDistance = Math.abs(rectBody.top - (rect?.top ?? 0));

    if (window.innerWidth < 768) {
      document.body.style.position = "fixed";
      document.body.style.top = `${-mouseWheelDistance}px`;
      document.body.style.left = "-5px";
      const phoneBlock = document.querySelector("canvas");
      if (phoneBlock) {
        phoneBlock.style.transform = `translate3d(0,${mouseWheelDistance}px,0)`;
        phoneBlock.style.position = "absolute";
        phoneBlock.setAttribute("stop", "stop");
      }
    } else {
      document.body.style.overflow = "hidden";
    }

    this.isDisabledScroll = true;
  }

  private scrollTurnOn() {
    if (this.isDisabledScroll === false) return;

    if (window.innerWidth < 768) {
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";

      const phoneBlock = document.querySelector("canvas");
      if (phoneBlock) {
        phoneBlock.setAttribute("stop", "start");
        phoneBlock.style.transform = ``;
        phoneBlock.style.position = "fixed";
      }
      window.scroll(x, y + this.deltaY * 1.5);
    } else {
      document.body.style.overflow = "initial";
    }

    this.isFirst = true;
    this.isDisabledScroll = false;
    this.isOutside = true;
  }

  private uploadPositionSlideAfterLinks() {
    const links = document.querySelectorAll("a");
    links.forEach((el) => {
      el.addEventListener("click", () => {
        this.scrollTurnOff();
      });
    });
  }
  positionVertical = true;
  public watchToWheel() {
    this.uploadPositionSlideAfterLinks();
    let prevPos = 0;
    const start = () => {
      const rect = this.section?.getBoundingClientRect();
      const rectBody = document.body.getBoundingClientRect();

      const scrollTopFrame = Math.abs(
        document.body.getBoundingClientRect().top
      );

      const mouseWheelDistance = Math.abs(rectBody.top - (rect?.top ?? 0));

      const isActiveLastElement =
        this.activeElement === (this.elementDot?.length ?? 0) - 1;
      const isActiveFirstElement = this.activeElement === 0;

      if (
        scrollTopFrame <= mouseWheelDistance - 50 ||
        scrollTopFrame >= mouseWheelDistance + (rect?.height ?? 0) + 50
      ) {
        this.scrollTurnOn();
      }
      if (scrollTopFrame >= mouseWheelDistance + (rect?.height ?? 0)) {
        this.scrollTurnOn();
        if (this.positionVertical) {
          this.positionVertical = false;
          this.activeElement = (this.elementDot?.length ?? 0) - 1;
          this.turnActive(this.activeElement);
        }
      }

      if (scrollTopFrame < mouseWheelDistance / 2) {
        if (this.positionVertical === false) {
          this.positionVertical = true;
          this.activeElement = 0;
          this.turnActive(this.activeElement);
        }
      }
      // UP
      if (scrollTopFrame - prevPos < 0) {
        if (!isActiveFirstElement && scrollTopFrame < mouseWheelDistance) {
          this.scrollTurnOff("up");
        }
      }
      // DOWN
      if (scrollTopFrame - prevPos > 0) {
        if (
          scrollTopFrame > mouseWheelDistance &&
          scrollTopFrame < mouseWheelDistance + (rect?.height ?? 0) &&
          !isActiveLastElement
        ) {
          this.scrollTurnOff("down");
        }
      }
      prevPos = scrollTopFrame;
      if (this.isOutside && this.isDisabledScroll) {
        this.isOutside = false;
        setTimeout(() => {
          window.scrollTo({
            top: mouseWheelDistance,
            behavior: "smooth",
          });
          // document.body.style.top = String(mouseWheelDistance)
        }, 0);

        setTimeout(() => {
          this.isFirst = false;
        }, 1400);
      }
      requestAnimationFrame(start);
    };
    start();

    const rect = this.section?.getBoundingClientRect();
    const rectBody = document.body.getBoundingClientRect();
    this.offSetTopSection = (rect?.top ?? 0) - rectBody?.top;
    const handler = <T extends WheelEvent>(e: T) => {
      if (this.isDisabledScroll) {
        e.preventDefault();
      }

      this.deltaY = e?.deltaY;

      this.slideSwitcher();
    };
    if ("ontouchstart" in window) {
      let event: TouchEvent | null = null;
      document.addEventListener(
        "touchstart",
        (e) => {
          if (this.isDisabledScroll) {
            e.preventDefault();
          } else {
            event = e;
          }
        },
        { passive: false }
      );
      document.addEventListener(
        "touchmove",
        (e) => {
          if (this.isDisabledScroll) {
            e.preventDefault();
          } else {
            if (event) {
              this.deltaY = event.touches[0].pageY - e.touches[0].pageY;
            }
            this.slideSwitcher();
          }
        },
        { passive: false }
      );
      document.addEventListener(
        "touched",
        (e) => {
          if (this.isDisabledScroll) {
            e.preventDefault();
          } else {
            event = null;
          }
        },
        { passive: false }
      );

      this.section?.addEventListener(
        "touchstart",
        (e) => {
          event = e;
        },
        { passive: false }
      );
      this.section?.addEventListener(
        "touchmove",
        (e) => {
          if (event) {
            this.deltaY = event.touches[0].pageY - e.touches[0].pageY;
          }
          this.slideSwitcher();
        },
        { passive: false }
      );
      this.section?.addEventListener(
        "touched",
        (_e) => {
          event = null;
        },
        { passive: false }
      );
    } else {
      window.addEventListener("wheel", handler, wheelOpt);
    }
  }

  public init() {
    this.createDots();
    this.watchToWheel();
  }
}

const benefitsSlider = new BenefitsSlider();
benefitsSlider.init();

export default BenefitsSlider;
