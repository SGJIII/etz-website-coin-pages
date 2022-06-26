export const detectDevice = () => {
  const isMobile = window.matchMedia || window.msMatchMedia;
  if (isMobile) {
    const match_mobile = isMobile("(pointer:coarse)");
    return match_mobile.matches;
  }
  return false;
};
