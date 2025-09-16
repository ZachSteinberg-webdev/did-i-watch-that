import axios from "axios";
import { toast } from "react-hot-toast";

import Toast from "../../components/Toast.jsx";

const useHandleRegistrationSubmit = async (
  e,
  name,
  email,
  password,
  setUser,
  navigate,
  beginMigrationUI,
  resetMigrationUI,
) => {
  e.preventDefault();
  let spinnerTimer;
  let spinnerShown = false;
  try {
    const { data } = await axios.post("/api/register", {
      name,
      email,
      password,
    });
    if (data.success === true) {
      setUser({ name: "", email: "", password: "" });
      const messageHeader = "Registration successful! Welcome aboard!";
      const messageArray = ["You are now registered and logged in."];
      toast.success(
        <Toast
          icon="👍"
          messageHeader={messageHeader}
          messageArray={messageArray}
        />,
        { icon: false },
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(data));
        localStorage.setItem("userPrefersDarkMode", true);
      }
      // If guest data exists, migrate it then clear guest mode
      try {
        const guestMode = JSON.parse(
          localStorage.getItem("guestMode") || "false",
        );
        if (guestMode) {
          spinnerTimer = setTimeout(() => {
            beginMigrationUI();
            spinnerShown = true;
          }, 1000);
          await migrateGuestData();
          localStorage.removeItem("guestMode");
          localStorage.removeItem("guestBannerDismissed");
          clearTimeout(spinnerTimer);
          if (!spinnerShown) {
            resetMigrationUI();
          }
        }
      } catch (err) {
        console.log("Guest migration error on registration", err);
        clearTimeout(spinnerTimer);
        resetMigrationUI();
      }
      navigate("/tracker");
    }
  } catch (err) {
    clearTimeout(spinnerTimer);
    resetMigrationUI();
    console.log("Error in frontend Register.jsx", err);
    let messageArray = err.response.data.error;
    toast.error(
      <Toast
        icon="👎"
        messageHeader="Registration failed:"
        messageArray={messageArray}
      />,
      { icon: false },
    );
  }
};

export default useHandleRegistrationSubmit;

// Helper: migrate guest data to server
async function migrateGuestData() {
  try {
    const showsRaw = localStorage.getItem("guestTrackedShows");
    const watchedRaw = localStorage.getItem("guestWatchedEpisodes");
    const shows = showsRaw ? JSON.parse(showsRaw) : [];
    const watchedMap = watchedRaw ? JSON.parse(watchedRaw) : {};
    if (shows.length === 0 && Object.keys(watchedMap).length === 0) {
      localStorage.removeItem("guestTrackedShows");
      localStorage.removeItem("guestWatchedEpisodes");
      return true;
    }
    const response = await axios.post("/api/migrateGuestData", {
      trackedShows: shows,
      watchedEpisodes: watchedMap,
    });
    if (response.data && response.data.success) {
      localStorage.removeItem("guestTrackedShows");
      localStorage.removeItem("guestWatchedEpisodes");
      return true;
    }
  } catch (err) {
    console.log("Error during guest migration", err);
    return false;
  }
  return false;
}
