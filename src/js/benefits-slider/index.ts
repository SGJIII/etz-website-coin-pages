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

  turnActive(idx: number, hidden?: boolean) {
    if (this.elementDot === null) return;
    this.calcPosition(idx);

    const style = hidden
      ? `--position: -${this.positon}px; transition-duration: 0ms;`
      : `--position: -${this.positon}px`;
    this.elementContainder?.setAttribute("style", style);

    if (hidden) {
      setTimeout(() => {
        if (this.elementContainder === null) return;
        this.elementContainder.style.transitionDuration = "1s";
      }, 100);
    }

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

  private nextSlide(e: WheelEvent) {
    if (this.section === null || this.elementDot === null) return;

    if (e.deltaY < 0) {
      if (this.activeElement === 0) {
        this.scrollTurnOn();
      }
      if (this.activeElement > 0) {
        this.activeElement--;
        this.elementDot[this.activeElement]?.click();
      }
    } else if (e.deltaY > 0) {
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

  private slideSwitcher(e: WheelEvent) {
    if (
      this.isDisabledScroll === false ||
      this.isFirst === true ||
      this.isScrolling === true
    )
      return false;

    this.isScrolling = true;

    clearTimeout(this.__scrollId);
    this.__scrollId = setTimeout(() => {
      this.nextSlide(e);

      setTimeout(() => {
        this.isScrolling = false;
      }, 1000);
    }, 300);

    return true;
  }

  private scrollTurnOff(_name?: string) {
    document.body.style.overflow = "hidden";
    this.isDisabledScroll = true;
  }

  private scrollTurnOn() {
    if (this.isDisabledScroll === false) return;

    document.body.style.overflow = "initial";
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

    const start = () => {
      const rect = this.section?.getBoundingClientRect();
      const rectBody = document.body.getBoundingClientRect();
      const scrollTopFrame =
        document.body.scrollTop || document.documentElement.scrollTop;

      const mouseWheelDistance = Math.abs(rectBody.top - (rect?.top ?? 0));

      const isActiveLastElement =
        this.activeElement === (this.elementDot?.length ?? 0) - 1;
      const isActiveFirstElement = this.activeElement === 0;

      if (
        scrollTopFrame + (rect?.height ?? 0) <= mouseWheelDistance * 1.5 ||
        scrollTopFrame >= mouseWheelDistance / 0.5 + (rect?.height ?? 0)
      ) {
        this.scrollTurnOn();
      }
      if (scrollTopFrame >= mouseWheelDistance + (rect?.height ?? 0)) {
        this.scrollTurnOn();
        if (this.positionVertical) {
          this.positionVertical = false;
          this.activeElement = (this.elementDot?.length ?? 0) - 1;
          this.turnActive(this.activeElement, true);
        }
      }

      if (scrollTopFrame < mouseWheelDistance / 2) {
        if (this.positionVertical === false) {
          this.positionVertical = true;
          this.activeElement = 0;
          this.turnActive(this.activeElement, true);
        }
      }
      // UP
      if (this.deltaY < 0) {
        if (!isActiveFirstElement && scrollTopFrame < mouseWheelDistance) {
          this.scrollTurnOff("up");
        }
      }
      // DOWN
      if (this.deltaY > 0) {
        if (
          scrollTopFrame > mouseWheelDistance &&
          scrollTopFrame < mouseWheelDistance + (rect?.height ?? 0) &&
          !isActiveLastElement
        ) {
          this.scrollTurnOff("down");
        }
      }

      if (this.isOutside && this.isDisabledScroll) {
        this.isOutside = false;
        setTimeout(() => {
          window.scrollTo({
            top: mouseWheelDistance,
            behavior: "smooth",
          });
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

    window.addEventListener(
      "wheel",
      (e) => {
        if (this.isDisabledScroll) {
          e.preventDefault();
        }

        this.deltaY = e.deltaY;

        if (this.isFirst) {
          this.deltaY2 = e.deltaY;
        }

        // console.log("this.isDisabledScroll", this.isDisabledScroll);
        this.slideSwitcher(e);
      },
      wheelOpt
    );
  }

  public init() {
    this.createDots();
    this.watchToWheel();
  }
}

const benefitsSlider = new BenefitsSlider();
benefitsSlider.init();

export default BenefitsSlider;
