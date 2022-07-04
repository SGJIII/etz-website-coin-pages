import { createElement } from "./utils/createElement";

export enum MessageType {
  success = "success",
  error = "error",
  text = "text",
}

type GenerateMessageProps = {
  id: string | number;
  title?: string;
  text: string;
  type: MessageType;
};
class Notification {
  static notification: Element = createElement("div");
  static idList: (number | string)[] = [];

  constructor() {
    Notification.notification.className = "Notification";
    document.body.appendChild(Notification.notification);
  }

  static dismissMessage(id: string | number) {
    let element: HTMLElement | null = null;
    const idxId = Notification.idList.findIndex(
      (el) => String(id) === String(el)
    );
    Notification.idList.splice(idxId, 1);
    element = document.querySelector(`.message--${id}`);
    element?.classList.remove("Notification_messageContainer__received");

    setTimeout(() => {
      if (element === null) return;
      Notification.notification.removeChild(element);
    }, 700);
  }

  static generateMessage({
    id,
    title,
    text,
    type = MessageType.text,
  }: GenerateMessageProps) {
    const isElement = ~Notification.idList.findIndex(
      (el) => String(el) === String(id)
    );
    if (isElement) return;

    Notification.idList.push(String(id));
    const messageContainer = createElement("div");
    const content = createElement("div");
    content.className = "Notification_content";
    const titleElement = createElement("span");
    const textElement = createElement("span");
    content.appendChild(titleElement);
    content.appendChild(textElement);

    titleElement.textContent = title ?? null;
    textElement.textContent = text;
    messageContainer.className = `Notification_messageContainer message--${id}`;

    const exitElement = createElement("img");
    exitElement.className = "Notification_exit";
    exitElement.setAttribute("src", "/exit-24.svg");
    exitElement.addEventListener("click", () => {
      Notification.dismissMessage(id);
    });
    switch (type) {
      case MessageType.error:
        messageContainer.classList.add("Notification_messageContainer__error");
        break;
      case MessageType.success:
        messageContainer.classList.add(
          "Notification_messageContainer__success"
        );
        exitElement.setAttribute("src", "/exit-24-light.svg");
        break;
      default:
        exitElement.setAttribute("src", "/exit-24.svg");
        break;
    }

    messageContainer.appendChild(content);
    messageContainer.appendChild(exitElement);

    Notification.notification.appendChild(messageContainer);
    setTimeout(() => {
      messageContainer.classList.add("Notification_messageContainer__received");
      setTimeout(() => {
        Notification.dismissMessage(id);
      }, 5000);
    }, 10);
  }
}

export default Notification;
export const generateMessage = Notification.generateMessage;
export const dismissMessage = Notification.dismissMessage;
