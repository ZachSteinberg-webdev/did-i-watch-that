import React, { useState, Fragment } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import Toast from "../components/Toast.jsx";
import ShowButtonForm from "../components/ShowButtonForm.jsx";

import "../css/AddShowSuggestions.css";

export default function AddShowFormSuggestions({
  showData,
  handleAddedShowSubmit,
  handleShowDetailsButtonClick,
}) {
  return showData && showData.length === 0 ? (
    <p className="add-show-results-header">
      Sorry! No shows were found using that search term. :(
    </p>
  ) : (
    <>
      {showData &&
        showData.map((show, index) => {
          return (
            <ShowButtonForm
              key={`add-show-result-form-${index}`}
              showFormClassName={"add-show-result-form"}
              showFormId={`add-show-result-form-${index}`}
              showFormOnSubmit={handleAddedShowSubmit}
              showButtonClassName={
                "add-show-result-button eligible-click-element"
              }
              showButtonId={`add-show-result-button-${index}`}
              showButtonType={"submit"}
              showButtonValue={JSON.stringify(show.show)}
              infoButtonDummyClassName={"add-show-result-details-dummy-button"}
              showButtonOuterDivClassName={
                "add-show-result-show-name-and-premiere-date-container"
              }
              showButtonInnerDivClassName={"add-show-result-show-name"}
              showButtonShowName={show.show.name}
              showButtonPremiereDateClassName={
                "add-show-result-show-premiere-date"
              }
              showButtonPremiereDateSmallClassName={
                "add-show-result-show-premiere-date-small"
              }
              showButtonPremiereDate={show.show.premiered}
              infoButtonClassName={
                "add-show-result-details-open-button eligible-click-element"
              }
              infoButtonValue={JSON.stringify(show.show)}
              infoButtonType={"submit"}
              infoButtonOnClick={handleShowDetailsButtonClick}
              infoButtonFontPathClassName={
                "tracker-details-open-button-icon-font"
              }
              infoButtonFontColor={"var(--svg-font-color-info-button-details)"}
              infoButtonSvgClassName={
                "add-show-result-show-details-open-button-svg"
              }
              infoButtonPathClassName={
                "add-show-result-details-open-button-path"
              }
              infoButtonPathFillColor={"#A7A7A7"}
            />
          );
        })}
    </>
  );
}
