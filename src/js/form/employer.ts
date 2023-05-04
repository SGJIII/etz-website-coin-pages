import { API } from "../api";
import * as yup from "yup";
import "yup-phone";
import { generateMessage, MessageType, dismissMessage } from "../notification";
import { resetField } from "../utils/resetField";

type DataForm = {
  check: boolean;
  companyPosition: string;
  email: string;
  name: string;
  note: string;
  phone: string;
};

enum InputId {
  ContactUsInputCheck = "ContactUsInputCheck",
  ContactUsInputName = "ContactUsInputName",
  ContactUsInputEmail = "ContactUsInputEmail",
  ContactUsInputPhone = "ContactUsInputPhone",
}
class ContactFrom {
  private buttonSubmit: HTMLButtonElement | null = null;
  private inputElements: HTMLInputElement[] = [];

  private schema = yup.object().shape({
    email: yup
      .string()
      .required("Please fill in all the required fields")
      .email("Please provide a valid email address")
      .max(255),
    name: yup.string().required("Please fill in all the required fields"),
    phone: yup.string(),
    companyPosition: yup.string(),
    note: yup.string(),
    check: yup
      .boolean()
      .oneOf([true], "Please fill in all the required fields"),
  });

  public init() {
    window.addEventListener("load", () => {
      this.buttonSubmit = document.querySelector<HTMLButtonElement>(
        "[data-name=ContactUsInputSubmit]"
      );
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "[data-name=ContactUsForm] input"
        )
      );
      const textareas = Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "[data-name=ContactUsForm] textarea"
        )
      );

      this.inputElements = [...inputs, ...textareas];

      // const handleValidateInput = (el: HTMLInputElement) => (e: Event) => {
      //   const event = e as HTMLElementEvent<HTMLInputElement>;

      //   if (event.currentTarget?.value === undefined) return;
      //   this.validateField(
      //     event.srcElement.name,
      //     event.srcElement.type === "checkbox"
      //       ? el.checked
      //       : event.currentTarget?.value
      //   );
      // };
      // this.inputElements.forEach((el) => {
      //   el.addEventListener("change", handleValidateInput(el));
      //   el.addEventListener("focusout", handleValidateInput(el));
      // });

      this.buttonSubmit?.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          this.buttonSubmit?.classList.add("Button__loading");
          await this.handleSumbit();
          this.inputElements.forEach(resetField());
        } finally {
          this.buttonSubmit?.classList.remove("Button__loading");
        }
      });

      document
        .querySelector<HTMLInputElement>(".ContactUsSection_form")
        ?.addEventListener("keyup", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            this.buttonSubmit?.click();
          }
        });
    });
  }

  private async handleSumbit() {
    const data = this.inputElements.reduce<DataForm>(
      (acc, input) => {
        switch (input.type) {
          case "text":
          case "textarea":
          case "email":
          case "tel":
            return {
              ...acc,
              [input.name]: input.value,
            };
          case "checkbox":
            return {
              ...acc,
              [input.name]: input.checked,
            };
          default:
            return acc;
        }
      },
      {
        check: false,
        companyPosition: "",
        email: "",
        name: "",
        note: "",
        phone: "",
      }
    );

    const isValid = await this.validateData(data);
    if (isValid === false) return;
    await this.sendData(data);
  }

  private async sendData(data: DataForm) {
    const res = await API.post("/landing/contact", data);
    if (!res?.data?.success) return;

    // if (this.buttonSubmit) this.buttonSubmit.disabled = true;

    generateMessage({
      id: "success",
      text: "Thanks for messaging us! Our manager will contact you soon",
      type: MessageType.success,
    });
  }

  private async validateData(data: DataForm) {
    for (const key of Object.keys(this.schema.fields)) {
      const path = key as keyof DataForm;

      this.validateField<DataForm>(path, data[path]);
    }

    const isValid = await this.schema.isValid(data);
    if (isValid) {
      Object.keys(InputId).forEach((idInput) => {
        dismissMessage(idInput);
        this.turnOffError(
          `[data-name=${idInput}]`,
          idInput === InputId.ContactUsInputCheck
            ? "ContactUsSection_checkbox__error"
            : undefined
        );
      });
    }

    return isValid;
  }

  private validateField<T extends DataForm, K extends keyof T = keyof T>(
    path: string,
    value: T[K]
  ) {
    const errorParams = (
      key: string
    ):
      | [id: string | number, selector: string, className?: string | undefined]
      | null => {
      switch (key) {
        case "check":
          return [
            // InputId.ContactUsInputCheck,
            "requiere",
            "[data-name=ContactUsInputCheck]",
            "ContactUsSection_checkbox__error",
          ];
        case "email":
          return [
            // InputId.ContactUsInputEmail,
            "requiere",
            "[data-name=ContactUsInputEmail]",
          ];

        case "name":
          return [
            // InputId.ContactUsInputName,
            "requiere",
            "[data-name=ContactUsInputName]",
          ];

        case "phone":
          return [
            InputId.ContactUsInputPhone,
            "requiere",
            "[data-name=ContactUsInputPhone]",
          ];
        default:
          return null;
      }
    };

    const paramsForError = errorParams(path);
    if (!paramsForError) return;
    yup
      .reach(this.schema, path)
      .validate(value)
      .then(() => {
        this.turnOffError(paramsForError[1], paramsForError[2]);
      })
      .catch(this.handleError(...paramsForError));
  }

  public turnOnError(selector: string, className?: string) {
    const element = document.querySelector(selector);
    element?.classList.add(className ?? "ContactUsSection_input__error");
  }

  public turnOffError(selector: string, className?: string) {
    const element = document.querySelector(selector);
    element?.classList.remove(className ?? "ContactUsSection_input__error");
  }

  private handleError(
    id: string | number,
    selector: string,
    className?: string
  ) {
    return (e: { message: string }) => {
      this.turnOnError(selector, className);
      generateMessage({
        text: e.message,
        type: MessageType.error,
        id: id,
      });
    };
  }
}

export default ContactFrom;
