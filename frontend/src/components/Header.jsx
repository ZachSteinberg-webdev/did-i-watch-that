import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import Toast from "./Toast.jsx";

import tvLogo from "../assets/tv-logo.png";
import hamburgerButtonPiece1 from "../assets/1-top-bread.png";
import hamburgerButtonPiece2 from "../assets/2-tomato.png";
import hamburgerButtonPiece3 from "../assets/3-cheese.png";
import hamburgerButtonPiece4 from "../assets/4-meat.png";
import hamburgerButtonPiece5 from "../assets/5-lettuce.png";
import hamburgerButtonPiece6 from "../assets/6-bottom-bread.png";

import usePrefersDarkMode from "../customHooks/dataFetchers/usePrefersDarkMode.jsx";
import useGetInitialDarkModePreference from "../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx";
import useHandleDarkModeToggle from "../customHooks/formSubmissionHandlers/useHandleDarkModeToggle.jsx";
import useExpandContractHamburgerButton from "../customHooks/helperFunctions/useExpandContractHamburgerButton.jsx";
import useExpandHamburgerButton from "../customHooks/helperFunctions/useExpandHamburgerButton.jsx";
import useContractHamburgerButton from "../customHooks/helperFunctions/useContractHamburgerButton.jsx";
import useHandleHamburgerClick from "../customHooks/eventListeners/useHandleHamburgerClick.jsx";
import useHandleHamburgerFocus from "../customHooks/eventListeners/useHandleHamburgerFocus.jsx";
import useHandleHamburgerBlur from "../customHooks/eventListeners/useHandleHamburgerBlur.jsx";
import useHandleHamburgerKeyDown from "../customHooks/eventListeners/useHandleHamburgerKeyDown.jsx";
import useHandleNavLinkBlur from "../customHooks/eventListeners/useHandleNavLinkBlur.jsx";
import useHandleNavLinkKeyDown from "../customHooks/eventListeners/useHandleNavLinkKeyDown.jsx";
import useHandleHamburgerMenuButtonKeydownListener from "../customHooks/eventListeners/useHandleHamburgerMenuButtonKeydownListener.jsx";
import useHandleLogout from "../customHooks/formSubmissionHandlers/useHandleLogout.jsx";

import "../css/Header.css";

export default function Header() {
  let usersDarkModePreference = JSON.parse(
    localStorage.getItem("userPrefersDarkMode"),
  );
  const location = useLocation();
  const guestMode = JSON.parse(localStorage.getItem("guestMode") || "false");
  const onTrackerPage = location.pathname === "/tracker";

  const [navDropdownShown, setNavDropdownShown] = useState(false);
  const [hamburgerButtonExpanded, setHamburgerButtonExpanded] = useState(false);
  const [hamburgerFocusTimeStamp, setHamburgerFocusTimeStamp] = useState(0);
  const [darkMode, setDarkMode] = useState(usersDarkModePreference);

  const handleDarkModeToggle = (e) => {
    useHandleDarkModeToggle(e, darkMode, setDarkMode);
  };

  useEffect(() => {
    useGetInitialDarkModePreference();
  }, []);

  const navDropdown = document.querySelector("#nav-dropdown");

  const expandContractHamburgerButton = () => {
    useExpandContractHamburgerButton(
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const expandHamburgerButton = () => {
    useExpandHamburgerButton(
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const contractHamburgerButton = () => {
    useContractHamburgerButton(
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };

  const handleHamburgerClick = (e) => {
    useHandleHamburgerClick(
      e,
      hamburgerFocusTimeStamp,
      expandContractHamburgerButton,
      navDropdownShown,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const handleHamburgerFocus = (e) => {
    useHandleHamburgerFocus(
      e,
      setHamburgerFocusTimeStamp,
      expandHamburgerButton,
      navDropdownShown,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const handleHamburgerBlur = (e) => {
    useHandleHamburgerBlur(
      e,
      navDropdown,
      contractHamburgerButton,
      navDropdownShown,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const handleHamburgerKeyDown = (e) => {
    useHandleHamburgerKeyDown(
      e,
      contractHamburgerButton,
      setNavDropdownShown,
      expandContractHamburgerButton,
      navDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const handleNavLinkBlur = (e) => {
    useHandleNavLinkBlur(
      e,
      navDropdown,
      navDropdownShown,
      contractHamburgerButton,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const handleNavLinkKeyDown = (e) => {
    useHandleNavLinkKeyDown(
      e,
      contractHamburgerButton,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  };
  const hamburgerMenuButtonRef = useRef(null);
  useEffect(() => {
    useHandleHamburgerMenuButtonKeydownListener(
      hamburgerMenuButtonRef,
      contractHamburgerButton,
      setNavDropdownShown,
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
  }, [hamburgerButtonExpanded]);
  const handleLogout = () => {
    useHandleLogout();
  };
  return (
    <>
      <header className="header-container">
        <div className="header-contents">
          <div className="header-left">
            <img className="header-logo" src={tvLogo} />
          </div>
          <div className="header-center">
            <p className="header-center-text">
              &#x1F914; Did I Watch That?!?! &#x1F9D0;
            </p>
          </div>
          <div className="header-right">
            <button
              className="user-button"
              type="button"
              onClick={handleHamburgerClick}
              onFocus={handleHamburgerFocus}
              onBlur={handleHamburgerBlur}
              onKeyDown={handleHamburgerKeyDown}
              ref={hamburgerMenuButtonRef}
            >
              <div className="user-button-pieces">
                <img
                  className="user-button-piece user-button-piece-1"
                  src={hamburgerButtonPiece1}
                />
                <img
                  className="user-button-piece user-button-piece-2"
                  src={hamburgerButtonPiece2}
                />
                <img
                  className="user-button-piece user-button-piece-3"
                  src={hamburgerButtonPiece3}
                />
                <img
                  className="user-button-piece user-button-piece-4"
                  src={hamburgerButtonPiece4}
                />
                <img
                  className="user-button-piece user-button-piece-5"
                  src={hamburgerButtonPiece5}
                />
                <img
                  className="user-button-piece user-button-piece-6"
                  src={hamburgerButtonPiece6}
                />
              </div>
            </button>
          </div>
        </div>
      </header>
      <div
        className={"nav-dropdown " + (navDropdownShown ? "show" : "")}
        id="nav-dropdown"
      >
        <Link className="nav-link" tabIndex="-1" onClick={handleDarkModeToggle}>
          <button
            className="nav-link-button"
            id="nav-link-button-dark-mode-switch"
            onBlur={handleNavLinkBlur}
            onKeyDown={handleNavLinkKeyDown}
          >
            {darkMode === true ? "Light Mode" : "Dark Mode"}
          </button>
        </Link>
        {!onTrackerPage && (
          <Link className="nav-link" to="/tracker" tabIndex="-1">
            <button
              className="nav-link-button"
              id="nav-link-button-tracker"
              onBlur={handleNavLinkBlur}
              onKeyDown={handleNavLinkKeyDown}
            >
              Show Tracker
            </button>
          </Link>
        )}
        {guestMode ? (
          <>
            <Link className="nav-link" to="/login" tabIndex="-1">
              <button
                className="nav-link-button"
                id="nav-link-button-login"
                onBlur={handleNavLinkBlur}
                onKeyDown={handleNavLinkKeyDown}
              >
                Log in
              </button>
            </Link>
            <Link className="nav-link" to="/register" tabIndex="-1">
              <button
                className="nav-link-button"
                id="nav-link-button-register"
                onBlur={handleNavLinkBlur}
                onKeyDown={handleNavLinkKeyDown}
              >
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/dashboard" tabIndex="-1">
              <button
                className="nav-link-button"
                id="nav-link-button-dashboard"
                onBlur={handleNavLinkBlur}
                onKeyDown={handleNavLinkKeyDown}
              >
                Dashboard
              </button>
            </Link>
            <Link
              className="nav-link"
              to="/"
              onClick={handleLogout}
              tabIndex="-1"
            >
              <button
                className="nav-link-button"
                id="nav-link-button-logout"
                onBlur={handleNavLinkBlur}
                onKeyDown={handleNavLinkKeyDown}
              >
                Log out
              </button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
