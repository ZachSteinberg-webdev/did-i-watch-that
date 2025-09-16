import React from "react";

import TrackerSectionHeader from "../components/TrackerSectionHeader.jsx";
import AddShowForm from "../components/AddShowForm.jsx";
import AddShowSuggestions from "../components/AddShowSuggestions.jsx";
import Spinner from "../components/Spinner.jsx";
import InfoButtonDummy from "../components/InfoButtonDummy.jsx";
import InfoButton from "../components/InfoButton.jsx";

import "../css/AddShowSection.css";

export default function AddShowSection({
  show,
  showData,
  handleShowChange,
  handleShowSubmit,
  handleAddedShowSubmit,
  showAddShowFormSpinner,
  handleShowAddInstructionsModalOpen,
  handleShowDetailsButtonClick,
  handleKeyUp,
}) {
  return (
    <>
      <TrackerSectionHeader
        sectionHeaderId={"tracker-show-add-header-container"}
        infoButtonDummyClassName={"show-add-instructions-dummy-button"}
        sectionHeaderParagraphId={"tracker-show-add-form-header"}
        sectionHeaderParagraphText={["Add", "a", "Show"]}
        infoButtonId={"show-add-instructions-open-button"}
        infoButtonOnClick={handleShowAddInstructionsModalOpen}
        infoButtonSvgId={"tracker-instructions-open-button-icon"}
        infoButtonFontPathClassName={
          "tracker-instructions-open-button-icon-font"
        }
        infoButtonFontColor={"var(--svg-font-color-info-button-instructions)"}
        infoButtonPathClassName={"show-add-instructions-open-button-path"}
        infoButtonPathFillColor={"#5460F7"}
      />
      <AddShowForm
        addShowFormId={"tracker-show-add-form"}
        addShowFormOnSubmit={handleShowSubmit}
        addShowFormInputId={"tracker-show-add-form-input"}
        addShowFormInputClassName={"eligible-click-element"}
        addShowFormInputType={"text"}
        addShowFormInputPlaceholder={"Enter a show name..."}
        addShowFormInputValue={show}
        addShowFormInputOnChange={handleShowChange}
        addShowFormInputAutofocus={true}
      />
      <div
        id="tracker-show-add-suggestions-container-wrapper"
        tabIndex="0"
        onKeyUp={handleKeyUp}
      >
        {showAddShowFormSpinner && (
          <Spinner spinnerClassName={"show-add-spinner"} />
        )}
        <div id="tracker-show-add-suggestions-container" tabIndex="-1">
          <AddShowSuggestions
            showData={showData}
            handleAddedShowSubmit={handleAddedShowSubmit}
            handleShowDetailsButtonClick={handleShowDetailsButtonClick}
          />
        </div>
      </div>
    </>
  );
}
