export const AddEventOrientationChange = (callback: () => void) => {
  window.addEventListener("orientationchange", () => {
    const afterOrientationChange = function () {
      callback();

      window.removeEventListener("resize", afterOrientationChange);
    };
    window.addEventListener("resize", afterOrientationChange);
  });
};
