export const resetField =
  (excludes?: string[]) => (field: HTMLInputElement | HTMLTextAreaElement) => {
    const dataInput = field.getAttribute("data-input");
    if (dataInput && excludes?.includes(dataInput)) return;

    if (field.type === "checkbox" && "checked" in field) {
      return (field.checked = false);
    }
    field.value = "";
  };
