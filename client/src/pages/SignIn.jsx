import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../components/Input";
import {
  requestFailure,
  requestStart,
  requestSuccess,
  clearError,
} from "../../store/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignInPage() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customTimeOut = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch(clearError());
        resolve();
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    const userData = {
      email: data.email,
      password: data.password,
    };

    try {
      dispatch(requestStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const resData = await response.json();

      if (!resData.success) {
        dispatch(requestFailure(resData));
        await customTimeOut();
        return;
      }

      dispatch(requestSuccess(resData));
      navigate("/");
    } catch (error) {
      dispatch(requestFailure(error));
      await customTimeOut();
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10">Sign In</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center space-y-4"
      >
        <Input type="email" name="email" placeholder="Email" required />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 sm:w-[28rem] sm:h-14"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      {error && <p className="mt-4 font-bold text-red-600">{error.message}</p>}
      <div className="flex justify-center mt-4 space-x-2">
        <p>Dont have an account?</p>
        <p className="text-blue-700 hover:opacity-90">
          <Link to={"/sign-up"}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
