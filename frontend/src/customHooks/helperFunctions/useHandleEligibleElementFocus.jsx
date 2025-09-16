const useHandleEligibleElementFocus = (setActiveElement) => {
  const handleEligibleElementFocus = (e) => {
    setActiveElement(e.target);
  };
  let eligibleClickElements = document.querySelectorAll(
    ".eligible-click-element",
  );
  eligibleClickElements.forEach((element, i) => {
    element.addEventListener("focus", handleEligibleElementFocus);
  });
};

export default useHandleEligibleElementFocus;
