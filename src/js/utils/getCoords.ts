export const getCoords = (element: Element | undefined, position: string) => {
  let point = { x: 0, y: 0 };
  if (!element) return point;
  const { top, left, width, height } = element.getBoundingClientRect();
  switch (position) {
    case "top left":
      point = {
        x: left + window.pageXOffset,
        y: top + window.pageYOffset,
      };
      break;
    case "top center":
      point = {
        x: left + width / 2 + window.pageXOffset,
        y: top + window.pageYOffset,
      };
      break;
    case "top right":
      point = {
        x: left + width + window.pageXOffset,
        y: top + window.pageYOffset,
      };
      break;
    case "center left":
      point = {
        x: left + window.pageXOffset,
        y: top + height / 2 + window.pageYOffset,
      };
      break;
    case "center":
      point = {
        x: left + width / 2 + window.pageXOffset,
        y: top + height / 2 + window.pageYOffset,
      };
      break;
    case "center right":
      point = {
        x: left + width + window.pageXOffset,
        y: top + height / 2 + window.pageYOffset,
      };
      break;
    case "bottom left":
      point = {
        x: left + window.pageXOffset,
        y: top + height + window.pageYOffset,
      };
      break;
    case "bottom center":
      point = {
        x: left + width / 2 + window.pageXOffset,
        y: top + height + window.pageYOffset,
      };
      break;
    case "bottom right":
      point = {
        x: left + width + window.pageXOffset,
        y: top + height + window.pageYOffset,
      };
      break;
  }
  return point;
};
