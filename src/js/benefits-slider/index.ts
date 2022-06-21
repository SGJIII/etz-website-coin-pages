import { getDataName } from "../utils/getDataName";
import { createElement } from "../utils/createElement";
import { enableScroll, disableScroll } from "../utils/scroll";

class BenefitsSlider {
  elementContainder: HTMLDivElement | null = null;
  elementSlide: NodeListOf<HTMLDivElement> | null = null;
  elementDotsContainder: HTMLDivElement | null = null;
  elementDot: Array<HTMLElement> | null = [];
  section: HTMLDivElement | null = null;
  widthSlides: number[] = [];
  positon = 0;
  activeElement = 0;
  freeze = false;
  rangeOut = true;
  isFirst = false;
  isFirstly = true;
  currentPosition = 0;
  isScrolling = false;
  scrolling = new Proxy(
    { isScrolling: false },
    {
      set(target, p, value, receiver) {
        // if (value === false) console.log(target, p, value, receiver);

        // target[p] = value;

        return true;
      },
    }
  );

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

  public init() {
    this.createDots();
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
        this.calcPosition(idx);
        this.elementContainder?.setAttribute(
          "style",
          `--position: -${this.positon}px`
        );
        this.elementDot?.forEach((el) => {
          el.classList.remove("BenefitsSection_dot__active");
        });
        dot.classList.add("BenefitsSection_dot__active");
        this.activeElement = idx;
      });

      this.elementDotsContainder?.appendChild(dot);
      this.elementDot?.push(dot);
    });
  }

  handleSlide(e: WheelEvent) {
    const position = this.calcPosition(this.activeElement);

    if (this.currentPosition === position) {
      if (this.section === null || this.elementDot === null) return;
      if (this.isFirst === false) {
        this.isFirst = true;
        return;
      }
      if (e.deltaY < 0) {
        // console.log("scrolling up");

        if (this.activeElement > 0) {
          this.activeElement--;
          this.elementDot[this.activeElement]?.click();
          if (this.activeElement === 0) {
            enableScroll();
            this.freeze = false;
            return;
          }
        }
      } else if (e.deltaY > 0) {
        if (this.activeElement < this.elementDot?.length - 1) {
          this.activeElement++;
          this.elementDot[this.activeElement]?.click();
          if (this.activeElement === this.elementDot?.length - 1) {
            enableScroll();
            this.freeze = false;
            return;
          }
        }
      }
    }
    // console.log({ position, currentPosition: this.currentPosition });

    this.currentPosition = position;
  }

  uploadPositionSlideAfterLinks() {
    const links = document.querySelectorAll("a");
    links.forEach((el) => {
      el.addEventListener("click", () => {
        if (this.section === null || this.elementDot === null) return;
        enableScroll();
        this.rangeOut = true;
        this.freeze = false;

        const rect = this.section.getBoundingClientRect();
        if (
          rect.top >= window.innerHeight / 5 ||
          rect.top < -window.innerHeight / 5
        ) {
          this.rangeOut = true;
          this.activeElement = rect.top >= 0 ? 0 : this.elementDot?.length - 1;
          this.elementDot[this.activeElement]?.click();
        }
      });
    });
  }

  setPosition() {
    let id: string | number | NodeJS.Timeout | undefined;
    let __scrollId: string | number | NodeJS.Timeout | undefined;

    window.addEventListener("wheel", (e) => {
      if (this.section === null || this.elementDot === null) return;
      const rect = this.section.getBoundingClientRect();
      if (!this.isScrolling && this.freeze) {
        // console.log("scrolling")
        if (this.isFirstly) {
          // console.log("isFirstly")
          setTimeout(() => {
            this.isFirstly = false;
          }, 600);
        } else {
          // console.log("isFirstly not")
          clearTimeout(__scrollId);
          this.isScrolling = true;

          __scrollId = setTimeout(() => {
            this.handleSlide(e);
            this.isScrolling = false;
          }, 300);
        }
      }
      if (
        rect.top >= window.innerHeight / 2 ||
        rect.top < -window.innerHeight / 2
      ) {
        this.rangeOut = true;
        this.isFirst = false;
        this.activeElement = rect.top >= 0 ? 0 : this.elementDot?.length - 1;
        this.elementDot[this.activeElement]?.click();
      }

      if (this.rangeOut === false && this.freeze === true) {
        // clearTimeout(id);
        // id = setTimeout(() => {
        //   if (this.section === null || this.elementDot === null) return;
        //   if (this.isFirst === false) {
        //     this.isFirst = true;
        //     return;
        //   }
        //   if (e.deltaY < 0) {
        //     // console.log("scrolling up");

        //     if (this.activeElement > 0) {
        //       this.activeElement--;
        //       this.elementDot[this.activeElement]?.click();
        //       if (this.activeElement === 0) {
        //         enableScroll();
        //         this.freeze = false;
        //         return;
        //       }
        //     }
        //   } else if (e.deltaY > 0) {
        //     if (this.activeElement < this.elementDot?.length - 1) {
        //       this.activeElement++;
        //       this.elementDot[this.activeElement]?.click();
        //       if (this.activeElement === this.elementDot?.length - 1) {
        //         enableScroll();
        //         this.freeze = false;
        //         return;
        //       }
        //     }
        //   }
        // }, 50);

        if (e.deltaY < 0) {
          if (this.activeElement === 0) {
            enableScroll();
            this.freeze = false;
            this.isFirstly = true;
          }
        } else if (e.deltaY > 0) {
          if (this.activeElement === this.elementDot?.length - 1) {
            enableScroll();
            this.isFirstly = true;
            this.freeze = false;
          }
        }
      }

      if (e.deltaY < 0) {
        if (
          rect.top >= 0 &&
          this.activeElement === this.elementDot?.length - 1
        ) {
          if (this.freeze === false) {
            disableScroll();
            this.rangeOut = false;
            this.freeze = true;
          }
        }
      } else if (e.deltaY > 0) {
        if (rect.top <= 0 && this.activeElement === 0) {
          // console.log("yes")
          if (this.freeze === false) {
            disableScroll();
            this.rangeOut = false;
            this.freeze = true;
          }
        }
      }

      if (this.freeze) {
        window.scrollTo({
          top: window.pageYOffset + rect.top,
          left: 0,
          behavior: "auto",
        });
      }
    });
  }
}

// benefitsSlider.setPosition();
// benefitsSlider.uploadPositionSlideAfterLinks();

const benefitsSlider = new BenefitsSlider();
benefitsSlider.init();

benefitsSlider.setPosition();
benefitsSlider.uploadPositionSlideAfterLinks();

export default BenefitsSlider;
