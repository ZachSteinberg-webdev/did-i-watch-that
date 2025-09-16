import axios from "axios";
import { toast } from "react-hot-toast";

import Toast from "../../components/Toast.jsx";

const useHandleLogout = () => {
  axios
    .get("/api/logout")
    .then((result) => {
      localStorage.removeItem("token");
      setTimeout(() => {
        toast.success(
          <Toast
            icon="👋‍"
            messageParagraph="You have successfully logged out. See you again soon!"
          />,
          { icon: false, id: "logoutNotifcation" },
        );
      }, 10);
    })
    .catch((err) => {
      console.log("Logout error from frontend Header.jsx", err);
      toast.error(
        <Toast icon="⚠️" messageParagraph="Logout failed. Please try again." />,
        { icon: false, id: "logoutNotifcation" },
      );
    });
};

export default useHandleLogout;
