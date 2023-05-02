import WorkspaceElement from "./utils/workspaceElement";

export default class Dropdown extends WorkspaceElement<HTMLElement> {
  value = "";
  input: HTMLElement | null = null;

  constructor(name: string) {
    super(name);
  }

  public init() {
    window.addEventListener("load", () => {
      this.element?.addEventListener("click", this.onClick.bind(this));
      this.initValue();
      this.initOptions();

      this.input = this.querySelector(".Dropdown__input");
    });

    window.addEventListener("click", this.onClickOutside.bind(this));
    window.removeEventListener("click", this.onClickOutside.bind(this));
  }

  private initValue() {
    this.element?.setAttribute("value", this.value);
  }

  private initOptions() {
    const options = this.element?.querySelectorAll("[name-option]");

    options?.forEach((el) => {
      el.addEventListener("click", this.onPick.bind(this));
    });
  }

  private onClick() {
    this.element?.classList.toggle("Dropdown_open");
  }

  private onClickOutside(e: Event) {
    if (e.target instanceof Element) {
      const target = e.target;
      const dropdown = target == this.element || this.element?.contains(target);
      const dropdownOpened = this.element?.classList.contains("Dropdown_open");

      if (!dropdown && dropdownOpened) {
        e.preventDefault();
        this.element?.classList.toggle("Dropdown_open");
      }
    }
  }

  private onPick(e: Event) {
    if (e.target instanceof Element) {
      const value = e.target.getAttribute("value");
      const label = e.target.innerHTML;
      if (value) this.setValue(value, label);
    }
  }

  private setValue(value: string, label: string) {
    if (!this.element) return null;
    this.element.setAttribute("value", value);

    if (!this.input) return null;
    this.input.innerHTML = label;
    this.input.classList.remove("Dropdown__input_placeholder");
  }

  public resetValue() {
    this.setValue("", "");
    if (this.input) this.input.innerHTML = "IRA Type";
    this.input?.classList.add("Dropdown__input_placeholder");
  }
}
