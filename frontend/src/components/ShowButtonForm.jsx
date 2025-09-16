import React from "react";

import InfoButtonDummy from "./InfoButtonDummy.jsx";
import InfoButton from "./InfoButton.jsx";

export default function ShowButtonForm({
  showFormClassName,
  showFormId,
  showFormOnSubmit,
  showFormKey,
  showButtonClassName,
  showButtonId,
  showButtonType,
  showButtonValue,
  infoButtonDummyClassName,
  showButtonOuterDivClassName,
  showButtonInnerDivClassName,
  showButtonShowName,
  showButtonPremiereDateClassName,
  showButtonPremiereDateSmallClassName,
  showButtonPremiereDate,
  infoButtonClassName,
  infoButtonValue,
  infoButtonType,
  infoButtonOnClick,
  infoButtonFontPathClassName,
  infoButtonFontColor,
  infoButtonSvgClassName,
  infoButtonPathClassName,
  infoButtonPathFillColor,
}) {
  return (
    <form
      className={showFormClassName}
      id={showFormId}
      onSubmit={showFormOnSubmit}
      key={showFormKey}
    >
      <button
        className={showButtonClassName}
        id={showButtonId}
        type={showButtonType}
        value={showButtonValue}
      >
        <InfoButtonDummy infoButtonDummyClassName={infoButtonDummyClassName} />
        <div className={showButtonOuterDivClassName}>
          <div className={showButtonInnerDivClassName}>
            {showButtonShowName}
          </div>
          <small className={showButtonPremiereDateClassName}>
            Premiered:{" "}
            {(showButtonPremiereDate &&
              new Date(showButtonPremiereDate).toLocaleDateString()) ||
              "unknown"}
          </small>
          <small className={showButtonPremiereDateSmallClassName}>
            {(showButtonPremiereDate &&
              new Date(showButtonPremiereDate).getFullYear()) ||
              "unknown"}
          </small>
        </div>
        <InfoButton
          infoButtonClassName={infoButtonClassName}
          infoButtonValue={infoButtonValue}
          infoButtonType={infoButtonType}
          infoButtonOnClick={infoButtonOnClick}
          infoButtonFontPathClassName={infoButtonFontPathClassName}
          infoButtonFontColor={infoButtonFontColor}
          infoButtonSvgClassName={infoButtonSvgClassName}
          infoButtonPathClassName={infoButtonPathClassName}
          infoButtonPathFillColor={infoButtonPathFillColor}
        />
      </button>
    </form>
  );
}
