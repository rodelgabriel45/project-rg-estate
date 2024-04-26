import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";

import Input from "../components/Input";
import {
  requestFailure,
  requestStart,
  clearError,
  clearState,
  requestSuccess,
} from "../../store/user/userSlice";
import { app } from "../firebase";

export default function ProfilePage() {
  const fileUpRef = useRef();
  const [fileUploaded, setFileUploaded] = useState();
  const [fileUploadPerc, setFileUploadPerc] = useState();
  const [fileUploadErr, setFileUploadErr] = useState();
  const [formData, setFormData] = useState();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const currentUserData = currentUser.data;
  const dispatch = useDispatch();

  const customTimeOut = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch(clearError());
        resolve();
      }, 2000);
    });
  };

  useEffect(() => {
    if (fileUploaded) {
      handleFileUpload(fileUploaded);
    }
  }, [fileUploaded]);

  const handleFileUpload = (fileUploaded) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + fileUploaded.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileUploaded);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPerc(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({
            ...formData,
            avatar: downloadUrl,
          });
        });
      }
    );
  };

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const handleSignOut = async () => {
    try {
      dispatch(requestStart());
      const response = await fetch("/api/auth/signout");
      const resData = await response.json();

      if (!resData.success) {
        dispatch(requestFailure(resData));
        await customTimeOut();
        return;
      }

      dispatch(clearState());
    } catch (error) {
      dispatch(requestFailure(error));

      await customTimeOut();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(requestStart());
      const response = await fetch(`/api/user/update/${currentUserData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!resData.success) {
        dispatch(requestFailure(resData));
        await customTimeOut();
        return;
      }

      dispatch(requestSuccess(resData));
    } catch (error) {
      dispatch(requestFailure(error));
      await customTimeOut();
    }
  };

  return (
    <div className="text-center mt-5 ">
      <h1 className="font-bold text-3xl sm:text-4xl mb-10">Profile</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center"
      >
        <input
          onChange={(e) => setFileUploaded(e.target.files[0])}
          type="file"
          ref={fileUpRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileUpRef.current.click()}
          className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] rounded-full border shadow-md cursor-pointer object-cover"
          src={formData?.avatar || currentUserData.avatar}
          alt="Avatar"
        />
        <p className="text-center mt-5">
          {fileUploadErr ? (
            <span className="text-red-700 font-semibold">
              Image Upload Failed! <br /> (Image must be less than 2MB).
            </span>
          ) : fileUploadPerc > 0 && fileUploadPerc < 100 ? (
            <span className="font-semibold">{`Uploading ${fileUploadPerc}%`}</span>
          ) : fileUploadPerc === 100 && !fileUploadErr ? (
            <span className="text-green-700 font-semibold">
              Image Uploaded Successfully!
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="flex flex-col space-y-4 mt-10">
          <Input
            onChange={(e) => {
              handleChange(e);
            }}
            id="username"
            type="text"
            defaultValue={currentUserData.username}
          />
          <Input
            onChange={(e) => {
              handleChange(e);
            }}
            id="email"
            type="email"
            defaultValue={currentUserData.email}
          />
          <Input
            onChange={(e) => {
              handleChange(e);
            }}
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 sm:w-[28rem] sm:h-14"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      {error && <p className="mt-4 font-bold text-red-600">{error.message}</p>}
      <div className="flex justify-between px-14 mt-2 sm:justify-center sm:mx-auto sm:space-x-[20.5rem] sm:max-w-max">
        <p className="text-red-700 text-sm font-semibold hover:opacity-70">
          <Link>Delete User</Link>
        </p>
        <p
          onClick={handleSignOut}
          className="text-red-700 text-sm font-semibold hover:opacity-70"
        >
          <Link>Signout</Link>
        </p>
      </div>
    </div>
  );
}
