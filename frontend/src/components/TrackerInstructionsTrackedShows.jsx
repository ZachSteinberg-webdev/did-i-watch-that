import React from "react";

import "../css/TrackerInstructions.css";

export default function TrackerInstructions({
  handleTrackedShowsInstructionsModalClose,
  preventPropagation,
}) {
  return (
    <div
      className="tracker-instructions-backdrop tracked-shows-instructions-backdrop"
      inert={"true"}
      onClick={handleTrackedShowsInstructionsModalClose}
    >
      <div
        className="tracker-instructions-container"
        onClick={preventPropagation}
      >
        <div className="tracker-instructions">
          <p className="tracker-tracked-shows-instructions-header tracker-instructions-header">
            Tracked Shows
          </p>
          <div className="tracker-instructions-text-scrollbox-wrapper">
            <div className="tracker-instructions-text-scrollbox">
              <p className="tracker-instructions-text">
                This is the list of shows you are tracking. To view the tracker
                for a show, click on it. To remove a show from your tracked
                shows list, click on the delete button to the right of it. If
                you accidentally remove a show from your tracked shows list,
                simply add it back using the Add a Show section and your watch
                history will be intact.
              </p>
              <p className="tracker-instructions-text">
                The "Tab" key can be used to cycle through your list of tracked
                shows. The "Shift + Tab" key combination can be used to cycle in
                reverse order. When your desired show is highlighted, the
                "Enter" key or Space Bar can be used to load that show into the
                show tracker.
              </p>
              <p className="tracker-show-add-instructions tracker-instructions-text">
                The "Alt+T" key combination can be used at any time to focus
                your <span className="italic">Tracked</span> Shows list. The
                "Left Arrow" and "Right Arrow" keys can be used to navigate
                across the three different panes. The header menu can be opened
                using the "Alt+H" key combination.
              </p>
            </div>
          </div>
          <button
            className="tracker-instructions-close-button"
            id="tracked-shows-instructions-close-button"
            onClick={handleTrackedShowsInstructionsModalClose}
            tabIndex="-1"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
