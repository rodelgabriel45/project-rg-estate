import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Input from "../components/Input";
import {
  requestFailure,
  requestStart,
  requestSuccess,
  clearError,
  clearLoading,
} from "../../store/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignUpPage() {
  const [signUpSuccess, setSignUpSuccess] = useState(false);
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

  useEffect(() => {
    if (signUpSuccess) {
      setTimeout(() => {
        setSignUpSuccess(false);
        navigate("/sign-in");
      }, 5000);
    }

    return () => {
      clearTimeout();
    };
  }, [signUpSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      dispatch(requestStart());
      const response = await fetch("/api/auth/signup", {
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
      setSignUpSuccess(true);
    } catch (error) {
      dispatch(requestFailure(error));
      await customTimeOut();
    }
  };

  return (
    <div className="text-center mt-10 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10">Sign Up</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center space-y-4"
      >
        <Input type="text" name="username" placeholder="Username" required />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      {signUpSuccess && (
        <p className="mt-4 font-bold text-green-700">
          User created successfully! Redirecting to sign-in...
        </p>
      )}
      {error && <p className="mt-4 font-bold text-red-600">{error.message}</p>}
      <div className="flex justify-center mt-4 space-x-2">
        <p>Have an account?</p>
        <p className="text-blue-700 hover:opacity-90">
          <Link to={"/sign-in"}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
