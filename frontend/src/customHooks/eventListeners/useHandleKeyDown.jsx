import { useEffect } from "react";

const useHandleKeyDown = () => {
  useEffect(() => {
    let trackerShowAddFormInput = document.querySelector(
      "#tracker-show-add-form-input",
    );
    let suggestionBoxWrapper = document.querySelector(
      "#tracker-show-add-suggestions-container-wrapper",
    );
    let trackedShowsBoxWrapper = document.querySelector(
      ".tracker-tracked-shows-list-container-wrapper",
    );
    let trackedShowListContainerWrapper = document.querySelector(
      ".tracker-tracked-show-list-container-wrapper",
    );
    const keyDownHandler = (e) => {
      if (e.altKey && e.code === "KeyI") {
        setTimeout(() => {
          trackerShowAddFormInput.focus({ focusVisible: true });
        }, 50); // setTimeout is necessary to prevent input from receiving keystroke
      } else if (e.altKey && e.code === "KeyA") {
        suggestionBoxWrapper.focus({ focusVisible: true });
      } else if (e.altKey && e.code === "KeyT") {
        trackedShowsBoxWrapper.focus({ focusVisible: true });
      } else if (e.altKey && e.code === "KeyS") {
        trackedShowListContainerWrapper.focus({ focusVisible: true });
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
};

export default useHandleKeyDown;
