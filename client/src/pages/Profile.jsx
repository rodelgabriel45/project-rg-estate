import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import Button from "../components/Button";

export default function ProfilePage() {
  const fileUpRef = useRef();
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState();
  const [fileUploadPerc, setFileUploadPerc] = useState();
  const [fileUploadErr, setFileUploadErr] = useState();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
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

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
    }

    return () => {
      clearTimeout();
    };
  }, [updateSuccess]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const handleSignOut = async () => {
    const proceed = window.confirm("Are you sure you want to logout?");

    if (proceed) {
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
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(requestFailure(error));
      await customTimeOut();
    }
  };

  const handleDeleteUser = async () => {
    const proceed = window.confirm(
      "This account will be deleted permanently. Continue?"
    );

    if (proceed) {
      try {
        const response = await fetch(
          `/api/user/delete/${currentUserData._id}`,
          {
            method: "DELETE",
          }
        );

        const resData = await response.json();

        if (!resData.success) {
          dispatch(requestFailure(resData.data));
          await customTimeOut();
          return;
        }

        dispatch(requestSuccess(resData));
      } catch (error) {
        dispatch(requestFailure(error));
        await customTimeOut();
      }
    }
  };

  const handleShowListings = async () => {
    try {
      const response = await fetch(`/api/user/listings/${currentUserData._id}`);
      const resData = await response.json();

      if (!resData.success) {
        dispatch(requestFailure(resData));
      }

      dispatch(clearError());
      setUserListings(resData.data);
    } catch (error) {
      dispatch(requestFailure(error));
    }
  };

  const handleDeleteListing = async (listingId) => {
    const proceed = window.confirm(
      "This listing will be deleted permanently. Proceed?"
    );

    if (proceed) {
      try {
        const response = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });

        const resData = await response.json();

        if (response.success === false) {
          console.log(resData);
          return;
        }

        setUserListings((prevState) =>
          prevState.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  return (
    <div className="text-center mt-5 min-h-screen">
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
        <div className="flex flex-col space-y-4 mt-10 mb-2">
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
        <Button
          bgColor="bg-slate-700"
          disabled={loading}
          className=" text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 sm:w-[28rem] sm:h-14"
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>
      <Link to={"/create-listing"}>
        <Button bgColor="bg-[#116530]">Create Listing</Button>
      </Link>

      {updateSuccess && (
        <p className="mt-4 font-bold text-green-600">Updated Successfully!</p>
      )}
      {error && <p className="mt-4 font-bold text-red-600">{error.message}</p>}
      <div className="flex justify-between px-14 mt-4 sm:justify-center sm:mx-auto sm:space-x-[20.5rem] sm:max-w-max">
        <p
          onClick={handleDeleteUser}
          className="text-red-700 text-sm font-semibold hover:opacity-70"
        >
          <Link>Delete User</Link>
        </p>
        <p
          onClick={handleSignOut}
          className="text-red-700 text-sm font-semibold hover:opacity-70"
        >
          <Link>Signout</Link>
        </p>
      </div>
      <button
        onClick={handleShowListings}
        className="text-green-600 font-semibold hover:opacity-70 mb-10"
      >
        Show Listings
      </button>
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:px-0 sm:gap-4">
        {userListings?.length > 0 &&
          userListings.map((listing) => {
            return (
              <div
                className="mx-auto mb-10 p-6 my-3 border-2 shadow-sm w-[28rem] xl:w-[40rem] rounded-lg hover:scale-105 transform transition ease-in-out"
                key={listing._id}
              >
                <div className="flex justify-between items-center space-x-10">
                  <Link to={`/listing/${listing._id}`}>
                    <div className="flex items-center gap-4">
                      <img
                        className="h-16 w-24 object-contain"
                        src={listing.imageUrls[0]}
                        alt="Listing Photo"
                      />
                      <h3 className="font-bold text-lg hover:underline truncate">
                        {listing.name}
                      </h3>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteListing(listing._id)}
                      className="text-black p-2 rounded-md border border-red-600 hover:bg-red-500 hover:text-white"
                    >
                      DELETE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditListing(listing._id)}
                      className="text-black p-2 rounded-md border border-green-600 hover:bg-green-500 hover:text-white"
                    >
                      EDIT
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
