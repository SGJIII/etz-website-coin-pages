export const AddEventOrientationChange = (callback: () => void) => {
  window.addEventListener("orientationchange", () => {
    const afterOrientationChange = function () {
      setTimeout(() => {
        callback();
      }, 50);

      window.removeEventListener("resize", afterOrientationChange);
    };
    window.addEventListener("resize", afterOrientationChange);
  });
};
