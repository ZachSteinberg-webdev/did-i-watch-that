import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useWindowWidth } from "@react-hook/window-size";

import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import LearnMore from "./pages/LearnMore.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Tracker from "./pages/Tracker.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import "./App.css";

function App() {
  const windowWidth = useWindowWidth();
  return (
    <>
      <Toaster
        position={windowWidth > 700 ? "top-right" : "top-center"}
        containerClassName="toast-container-wrapper"
        toastOptions={{
          className: "toast-container",
          duration: 3000,
          style: {
            maxWidth: "unset",
            backgroundColor: "var(--toast-background-color)",
            marginTop: "0.5rem",
            marginRight: "0.5rem",
            padding: "0",
            border: "var(--border-global)",
            borderRadius: "var(--border-radius-global)",
            color: "var(--font-color)",
            boxShadow: "0 0 1.5rem 0.5rem black",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tracker"
          element={
            <PrivateRoute>
              <Tracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
