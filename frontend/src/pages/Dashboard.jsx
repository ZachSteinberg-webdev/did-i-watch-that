import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import useGetUser from "../customHooks/dataFetchers/useGetUser.jsx";
import useHandleUserChange from "../customHooks/stateChanges/useHandleUserChange.jsx";
import useHandlePasswordChange from "../customHooks/stateChanges/useHandlePasswordChange.jsx";
import useHandleUserChangeSubmit from "../customHooks/formSubmissionHandlers/useHandleUserChangeSubmit.jsx";

import Toast from "../components/Toast.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import "../css/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const { name, email } = user;
  const { oldPassword, newPassword } = password;
  const handleUserChange = (name) => (e) => {
    useHandleUserChange(name, e, user, setUser);
  };
  const handlePasswordChange = (name) => (e) => {
    useHandlePasswordChange(name, e, password, setPassword);
  };
  const handleUserChangeSubmit = (e) => {
    useHandleUserChangeSubmit(
      e,
      name,
      email,
      oldPassword,
      newPassword,
      setUser,
    );
  };
  useEffect(() => {
    useGetUser(setUser, navigate);
  }, []);
  return (
    <>
      <Header />
      <div id="dashboard-page">
        <h1 className="dashboard-header">Dashboard</h1>
        <p className="dashboard-text">Manage your profile</p>
        <small className="dashboard-text-extra-small">
          You can update your username and/or email address below.
        </small>
        <small className="dashboard-text-extra-small">
          To update your password, enter your old password and a new password.
          Otherwise, leave both fields empty.
        </small>
        <form id="user-update-form" onSubmit={handleUserChangeSubmit}>
          <div className="form-inputs">
            <div className="form-group-one">
              <small className="dashboard-text-small">
                You can update your username and/or email address below.
              </small>
              <input
                type="text"
                placeholder="Name"
                value={name}
                autoFocus={true}
                onChange={handleUserChange("name")}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleUserChange("email")}
              />
            </div>
            <div className="form-group-two">
              <small className="dashboard-text-small">
                To update your password, enter your old password and a new
                password. Otherwise, leave both fields empty.
              </small>
              <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={handlePasswordChange("oldPassword")}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={handlePasswordChange("newPassword")}
              />
            </div>
          </div>
          <button id="user-update-button" type="submit">
            Update
          </button>
        </form>
        <div className="user-tracked-shows-list"></div>
      </div>
      <Footer />
    </>
  );
}
