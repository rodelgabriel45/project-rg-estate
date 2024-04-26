import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "../firebase";
import { requestSuccess } from "../../store/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const resData = await response.json();
      dispatch(requestSuccess(resData));
    } catch (error) {
      console.log("Could not sign google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-800 text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 sm:w-[28rem] sm:h-14"
    >
      Continue with Google
    </button>
  );
}
