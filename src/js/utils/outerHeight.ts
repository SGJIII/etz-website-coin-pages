export const outerHeight = (el: HTMLElement) => {
  let height = el.offsetHeight;
  const style = getComputedStyle(el);
  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};
