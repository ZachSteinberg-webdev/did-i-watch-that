import React from "react";

export default function ShowButtonDeleteForm({
  showFormDeleteClassName,
  showFormDeleteId,
  showFormDeleteOnSubmit,
  showButtonDeleteClassName,
  showButtonDeleteId,
  showButtonDeleteType,
  showButtonDeleteValue,
  showButtonDeleteCharacter,
}) {
  return (
    <form
      className={showFormDeleteClassName}
      id={showFormDeleteId}
      onSubmit={showFormDeleteOnSubmit}
    >
      <button
        className={showButtonDeleteClassName}
        id={showButtonDeleteId}
        type={showButtonDeleteType}
        value={showButtonDeleteValue}
        dangerouslySetInnerHTML={{ __html: showButtonDeleteCharacter }}
      ></button>
    </form>
  );
}
