import { API } from "../api";
import * as yup from "yup";
import "yup-phone";
import { generateMessage, MessageType } from "../notification";
import WorkspaceElement from "../../js/utils/workspaceElement";
import { checkAxiosError } from "../../js/utils/checkAxiosError";
import { resetField } from "../utils/resetField";
import Dropdown from "../dropdown";

enum ID {
  required,
  success,
  commonError,
}

export default class IndividualFrom extends WorkspaceElement<HTMLElement> {
  private buttonSubmit: HTMLButtonElement | null = null;
  private inputIraType: Dropdown | null = null;
  private inputElements: NodeListOf<HTMLInputElement> | null = null;

  private schema = yup.object().shape({
    email: yup
      .string()
      .required("Please fill in all the required fields")
      .email("Please provide a valid email address")
      .max(255),
    firstName: yup.string().required("Please fill in all the required fields"),
    lastName: yup.string().required("Please fill in all the required fields"),
    middleName: yup.string().optional(),
    signUpType: yup
      .string()
      .nullable()
      .required("Please fill in all the required fields"),
    check: yup
      .boolean()
      .oneOf([true], "Please fill in all the required fields"),
  });

  public init() {
    window.addEventListener("load", () => {
      this.initInputElements();
      this.initButtonSubmit();
    });

    this.inputIraType = new Dropdown("#DropdownIRA");
    this.inputIraType.init();
  }

  private initInputElements() {
    this.inputElements = this.querySelectorAll<HTMLInputElement>(
      "[data-name=ContactUsForm] [data-input]"
    );

    this.inputElements.forEach((element) => {
      element.addEventListener("click", () => {
        this.turnOffError(element);
      });
    });
  }

  private initButtonSubmit() {
    const buttonSubmit = this.querySelector<HTMLButtonElement>(
      "[data-name=ContactUsInputSubmit]"
    );

    this.buttonSubmit = buttonSubmit;
    if (buttonSubmit === null) return null;
    buttonSubmit.addEventListener("click", this.onSubmit.bind(this));

    document
      .querySelector<HTMLInputElement>(".ContactUsSection_form")
      ?.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          this.buttonSubmit?.click();
        }
      });
  }

  private async onSubmit(event: Event) {
    event.preventDefault();
    try {
      this.buttonSubmit?.classList.add("Button__loading");
      const [isValid, data] = await this.validateValues();
      if (isValid === false) return;

      const res = isValid ? await API.post("/landing/sign-up", data) : null;

      if (res) {
        generateMessage({
          text: "Thanks for messaging us! Our manager will contact you soon",
          type: MessageType.success,
          id: ID.success,
        });
        this.inputElements?.forEach(resetField(["type"]));
        this.inputIraType?.resetValue();
      }
    } catch (e) {
      const error = checkAxiosError(e);

      if (error) {
        generateMessage({
          text: error.response?.data.message ?? "",
          type: MessageType.error,
          id: ID.commonError,
        });
      }
    } finally {
      this.buttonSubmit?.classList.remove("Button__loading");
    }
  }

  private getValues() {
    const data: Record<string, unknown> = {};

    this.inputElements?.forEach(async (element) => {
      if (element.type === "checkbox")
        return (data[element.name] = element.checked);

      const value = element.value ?? element.getAttribute("value");
      const name = element.name ?? element.getAttribute("name");

      return (data[name] = value !== "" ? value : undefined);
    });

    return data;
  }

  private async validateValues() {
    const values = this.getValues();

    this.inputElements?.forEach(async (element) => {
      if (element.type === "checkbox") {
        yup
          .reach(this.schema, element.name)
          .validate(element.checked)
          .catch((e: { message: string }) => {
            this.turnOnError(element);
            generateMessage({
              text: e.message,
              type: MessageType.error,
              id: ID.required,
            });
          });
      } else if (element.getAttribute("type") === "selector") {
        yup
          .reach(this.schema, element.name ?? element.getAttribute("name"))
          .validate(element.value ?? element.getAttribute("value"))
          .catch((e: { message: string }) => {
            this.turnOnError(element);
            generateMessage({
              text: e.message,
              type: MessageType.error,
              id: ID.required,
            });
          });
      } else {
        yup
          .reach(this.schema, element.name)
          .validate(element.value)
          .catch((e: { message: string }) => {
            this.turnOnError(element);
            generateMessage({
              text: e.message,
              type: MessageType.error,
              id: ID.required,
            });
          });
      }
    });
    const isValid = await this.schema.isValidSync(values);
    return [isValid, values];
  }

  // Move to saparate class
  public turnOnError(element: HTMLInputElement) {
    element?.classList.add("Input_error");
  }

  // Move to saparate class
  public turnOffError(element: HTMLInputElement) {
    element?.classList.remove("Input_error");
  }
}
