import React from "react";
import "../css/Toast.css";

const mapErrorMessages = (array) => {
  let messages = array.map((message, index) => (
    <li className="toast-item" key={index}>
      {message}
    </li>
  ));
  return messages;
};

// Success toasts take an icon and a messageParagraph
// Error toasts take an icon, a messageHeader and a messageArray containing
// the specific error message(s) sent from the error.js middleware

export default function Toast(props) {
  return (
    <div className="toast-body">
      <div className="toast-icon">{props.icon}</div>
      <div className="toast-message">
        {props.messageHeader && (
          <p className="toast-header">{props.messageHeader}</p>
        )}
        {props.messageParagraph && (
          <p className="toast-paragraph">{props.messageParagraph}</p>
        )}
        {props.messageParagraphTwoIcons && (
          <p className="toast-paragraph-two-icons">
            {props.messageParagraphTwoIcons}
          </p>
        )}
        {props.messageArray && <ul>{mapErrorMessages(props.messageArray)}</ul>}
      </div>
      {props.icon2 && <div className="toast-icon">{props.icon2}</div>}
    </div>
  );
}
