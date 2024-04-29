import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListingPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadImageErr, setUploadImageErr] = useState(false);
  const [listingData, setListingData] = useState({
    imageUrls: [],
  });

  useEffect(() => {
    if (files.length > 0 && files.length < 7) {
      console.log("This rendered!!");
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

  const cssClasses =
    "shadow-md border border-slate-400 w-[24rem]  p-2 rounded-md";

  return (
    <main className="text-center mt-5 ">
      <h1 className="font-bold text-3xl md:text-4xl mb-10 md:mb-20">
        Create a listing
      </h1>
      <form className="mb-16 md:flex md:justify-center md:space-x-6">
        <div className="flex flex-col space-y-3 justify-center items-center sm:px-4 sticky">
          <input
            id="name"
            type="text"
            placeholder="Name"
            className={`${cssClasses} h-12 md:h-14 lg:w-[32rem]`}
            required
            minLength={10}
          />
          <textarea
            id="description"
            placeholder="Description"
            className={`${cssClasses} resize-none md:h-32 lg:w-[32rem]`}
            rows={3}
            required
          />
          <input
            id="address"
            type="text"
            placeholder="Address"
            className={`${cssClasses} h-12 md:h-14 lg:w-[32rem]`}
            required
          />
          <div className="flex gap-4">
            <div className="flex gap-1">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-10 flex-wrap px-4">
            <div className="flex items-center gap-1">
              <input
                type="number"
                id="bedrooms"
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
                id="baths"
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
                id="regular-price"
                className="p-2 border border-gray-300 rounded-md"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col">
                <span>Regular Price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                id="discounted-price"
                className="p-2 border border-gray-300 rounded-md"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col">
                <span>Discounted Price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
            type="submit"
            className="text-white bg-slate-700 p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 lg:w-[28rem] sm:h-14 md:ml-3"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
