export function getElementOffsetTop(element) {
  let offsetTop = 0;

  while (element && typeof element.offsetTop === "number") {
    offsetTop += element.offsetTop;
    element = element.parentNode;
  }

  return offsetTop;
}
