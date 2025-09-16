import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";
import { toast } from "react-hot-toast";

import Toast from "../components/Toast.jsx";
import Footer from "../components/Footer.jsx";
import GuestBanner from "../components/GuestBanner.jsx";

import tvLogo from "../assets/tv-logo.png";

import useGetUserWelcomeRedirect from "../customHooks/dataFetchers/useGetUserWelcomeRedirect.jsx";
import useGetInitialDarkModePreference from "../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      useGetUserWelcomeRedirect(navigate);
    }, 250);
  }, []);
  useEffect(() => {
    useGetInitialDarkModePreference();
  }, []);
  return (
    <>
      <GuestBanner />
      <div id="landing-page">
        <div className="landing-header">
          <h1 className="landing-header-text">
            &#x1F914; Did I Watch That?!?! &#x1F9D0;
          </h1>
          <img className="landing-header-img" src={tvLogo} />
        </div>
        <div className="landing-text">
          <p>
            Keep track of the TV shows you&apos;ve watched. Never find yourself
            wondering which season or episode you last watched.
          </p>
        </div>
        <div className="landing-buttons">
          <div id="landing-buttons-row-1">
            <Link to="/learn-more" tabIndex="-1">
              <button className="landing-button" id="landing-learn-more-button">
                Learn more...
              </button>
            </Link>
          </div>
          <div id="landing-page-buttons-row-2">
            <Link to="/login" tabIndex="-1">
              <button className="landing-button" id="landing-log-in">
                Log in
              </button>
            </Link>
            <Link to="/register" tabIndex="-1">
              <button className="landing-button" id="landing-register">
                Register
              </button>
            </Link>
          </div>
          <div id="landing-page-buttons-row-3">
            <button
              className="landing-button"
              id="landing-continue-as-guest"
              type="button"
              onClick={() => {
                localStorage.setItem("guestMode", "true");
                localStorage.removeItem("guestBannerDismissed");
                navigate("/tracker");
              }}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
