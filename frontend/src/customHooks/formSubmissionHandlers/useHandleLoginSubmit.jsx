import axios from "axios";
import { toast } from "react-hot-toast";

import Toast from "../../components/Toast.jsx";

const useHandleLoginSubmit = async (
  e,
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
    const { data } = await axios.post("/api/login", {
      email,
      password,
    });
    if (data.success === true) {
      setUser({ email: "", password: "" });
      toast.success(
        <Toast icon="👍" messageParagraph="Login successful! Come on in!" />,
        { icon: false },
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(data));
        localStorage.setItem("userPrefersDarkMode", data.user.prefersDarkMode);
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
        console.log("Guest migration error on login", err);
        clearTimeout(spinnerTimer);
        resetMigrationUI();
      }
      navigate("/tracker");
    }
  } catch (err) {
    clearTimeout(spinnerTimer);
    resetMigrationUI();
    console.log("Error in frontend Login.jsx", err);
    let messageArray = err.response.data.error;
    toast.error(
      <Toast
        icon="👎"
        messageHeader="Login failed:"
        messageArray={messageArray}
      />,
      { icon: false },
    );
  }
};

export default useHandleLoginSubmit;

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
