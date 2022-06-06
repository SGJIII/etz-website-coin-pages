import axios from "axios";

class ContactFrom {
  element: Element | null = null;
  public init() {
    // const element = document.querySelector("[data-name=ContactUsForm]");
    // console.dir(this.element);
    // element?.addEventListener("submit", function (event) {
    //   event.preventDefault();
    //   const FD = new FormData(element);
    //   console.log(FD);
    // });

    window.addEventListener("load", function () {
      const form = document.querySelector("[data-name=ContactUsForm]");
      function sendData() {
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

        const data = [...inputs, ...textareas].reduce(
          (acc, input) => ({
            ...acc,
            [input.name]: input.value,
          }),
          {}
        );

        axios.post(
          "http://etz-dev-landing-backend.us-east-1.elasticbeanstalk.com/api/landing/contact",
          data
        );
      }

      form?.addEventListener("submit", function (event) {
        event.preventDefault();

        sendData();
      });
    });
  }
}

export default ContactFrom;
