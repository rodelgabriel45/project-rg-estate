import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  requestStart,
  requestFailure,
  clearLoading,
  clearError,
} from "../../store/user/userSlice";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [createListingSuccess, setCreateListingSuccess] = useState(false);
  const [offerChecked, setOfferChecked] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const currentUserData = currentUser.data;
  const [files, setFiles] = useState([]);
  const [type, setType] = useState();
  const [listingResponse, setListingResponse] = useState(null);
  const [saleCheck, setSaleCheck] = useState(false);
  const [rentCheck, setRentCheck] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadImageErr, setUploadImageErr] = useState(false);
  const [listingData, setListingData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    if (createListingSuccess) {
      setTimeout(() => {
        const listingId = listingResponse.data._id;
        navigate(`/listing/${listingId}`);
      }, 3000);

      return () => {
        clearTimeout();
      };
    }
  }, [createListingSuccess]);

  useEffect(() => {
    if (listingResponse?.success) {
      setTimeout(() => {
        setListingResponse(null);
      }, 4000);

      return () => {
        clearTimeout();
      };
    }
  }, [listingResponse]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);

      return () => {
        clearTimeout();
      };
    }
  }, [error]);

  useEffect(() => {
    if (files.length > 0 && files.length < 7) {
      dispatch(clearError());
      setUploadImageErr(false);
    }

    if (files.length > 6) {
      setUploadImageErr(
        "You can only upload a maximum of 6 images per listing."
      );
    }
  }, [files]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + listingData.imageUrls.length < 7) {
      const promises = [];

      try {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
      } catch (error) {
        setUploadImageErr(error);
      }

      Promise.all(promises)
        .then((urls) => {
          setListingData({
            ...listingData,
            imageUrls: listingData.imageUrls.concat(urls),
          });
          setUploadImageErr(false);
          setUploading(false);
        })
        .catch((err) => {
          if (err.status === 403) {
            err.message =
              "You can only upload image files and image must be less 2mb or less!";
          }
          setUploadImageErr(err.message || "Error uploading image!");
          setUploading(false);
        });
    } else {
      setUploadImageErr("You can only upload maximum of 6 images per listing.");
      setUploading(false);
    }
  };

  const handleOfferChange = (e) => {
    if (e.target.checked) {
      setOfferChecked(true);
    } else {
      setOfferChecked(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setListingData({
      ...listingData,
      imageUrls: listingData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    if (listingData.imageUrls.length < 1) {
      dispatch(requestFailure("Please upload at least one image."));
      return;
    }

    setListingData({
      ...listingData,
      name: data.name,
      description: data.description,
      address: data.address,
      type: type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      regularPrice: data.regularPrice,
      discountedPrice: data.discountedPrice,
      offer: data.offer ? true : false,
      parking: data.parking ? true : false,
      furnished: data.furnished ? true : false,
    });
  };

  useEffect(() => {
    if (listingData.name && listingData.address) {
      const postListing = async () => {
        try {
          dispatch(requestStart());
          const response = await fetch("/api/listing/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...listingData,
              userRef: currentUserData._id,
            }),
          });

          const resData = await response.json();

          if (!resData.success) {
            dispatch(requestFailure(resData));
          }

          setListingResponse(resData);
          dispatch(clearLoading());
          setCreateListingSuccess(true);
        } catch (error) {
          requestFailure(error);
        }
      };

      postListing();
    }
  }, [listingData]);

  const handleChange = (e) => {
    if (e.target.name === "sale") {
      setSaleCheck((prevState) => !prevState);
    } else {
      setRentCheck((prevState) => !prevState);
    }

    if (e.target.checked) {
      setType(e.target.name);
    }
  };

  const cssClasses =
    "shadow-md border border-slate-400 w-[24rem]  p-2 rounded-md";

  return (
    <main className="text-center mt-5 min-h-screen">
      <h1 className="font-bold text-3xl md:text-4xl mb-10 md:mb-20">
        Create a listing
      </h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mb-16 md:flex md:justify-center md:space-x-6"
      >
        <div className="flex flex-col space-y-3 justify-center items-center sm:px-4 sticky">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className={`${cssClasses} h-12 md:h-14 lg:w-[32rem]`}
            required
            minLength={10}
          />
          <textarea
            name="description"
            placeholder="Description"
            className={`${cssClasses} resize-none md:h-32 lg:w-[32rem]`}
            rows={3}
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            className={`${cssClasses} h-12 md:h-14 lg:w-[32rem]`}
            required
          />
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 border-2 p-2">
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="sale"
                  className="w-5"
                  disabled={rentCheck}
                  onChange={(e) => handleChange(e)}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="rent"
                  className="w-5"
                  disabled={saleCheck}
                  onChange={(e) => handleChange(e)}
                />
                <span>Rent</span>
              </div>
            </div>

            <div className="flex gap-1">
              <input type="checkbox" name="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" name="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                name="offer"
                className="w-5"
                onChange={(e) => handleOfferChange(e)}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-10 flex-wrap px-4">
            <div className="flex items-center gap-1">
              <input
                type="number"
                name="bedrooms"
                className="p-2 border border-gray-300 rounded-md"
                min="1"
                max="10"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                name="bathrooms"
                className="p-2 border border-gray-300 rounded-md"
                min="1"
                max="10"
                required
              />
              <span>Baths</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <input
                type="number"
                name="regularPrice"
                className="p-2 border border-gray-300 rounded-md w-20"
                required
              />
              <div className="flex flex-col">
                <span>Price ($)</span>
                {rentCheck && <span className="text-xs">($ / month)</span>}
              </div>
            </div>
            {offerChecked && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  name="discountedPrice"
                  className="p-2 border border-gray-300 rounded-md w-20"
                  required
                />
                <div className="flex flex-col">
                  <span>Discounted Price</span>
                  {rentCheck && <span className="text-xs">($ / month)</span>}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:flex md:flex-col space-y-3 mt-5 md:mt-0 md:text-lg">
          <div className="flex gap-2">
            <span className="font-bold">Images:</span>
            <span> The first image will be the cover (max 6)</span>
          </div>

          <div className="space-x-2 space-y-2">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              className="border p-4 shadow-sm"
              accept="image/*"
              multiple
            />

            <button
              onClick={handleImageSubmit}
              disabled={uploading}
              type="button"
              className="bg-transparent border border-green-500 p-4 font-semibold disabled:text-gray-600 disabled:border-gray-600 text-green-500 rounded-md hover:bg-green-500 hover:text-white shadow-md"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {uploadImageErr && (
              <p className="text-red-500 text-sm py-3">{uploadImageErr}</p>
            )}
            <div className="sm:grid sm:grid-cols-2 sm:gap-2">
              {listingData.imageUrls.length > 0 &&
                listingData.imageUrls.map((image, index) => {
                  return (
                    <div
                      key={image}
                      className="flex justify-between p-3 border"
                    >
                      <img
                        src={image}
                        alt="listing image"
                        className="w-20 h-20 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-700 p-2 hover:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
          <button
            disabled={loading || uploading}
            type="submit"
            className="text-white bg-slate-700 p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 lg:w-[28rem] sm:h-14 md:ml-3"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-600">{error.message || error}</p>}
          {listingResponse?.success && (
            <p className="text-green-500 font-semibold">
              Listing Created Successfully! Redirecting now to your listing...
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
