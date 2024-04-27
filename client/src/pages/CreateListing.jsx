export default function CreateListingPage() {
  const cssClasses =
    "shadow-md border border-slate-400 w-[24rem]  p-2 rounded-md";

  return (
    <main className="text-center mt-5 ">
      <h1 className="font-bold text-3xl md:text-4xl mb-10 md:mb-20">
        Create a listing
      </h1>
      <form className="md:flex md:justify-center md:space-x-6">
        <div className="flex flex-col space-y-4 justify-center items-center sm:px-4">
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
        <div className="space-y-4 mt-5 md:mt-0 md:text-lg">
          <span className="font-bold">Images:</span>
          <span> The first image will be the cover (max 6)</span>
          <div className="space-x-3 px-4">
            <input
              type="file"
              className="border p-4 shadow-sm"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              className="bg-transparent border border-green-500 p-4 font-semibold text-green-500 rounded-md hover:bg-green-500 hover:text-white shadow-md"
            >
              Upload
            </button>
          </div>
          <button
            type="submit"
            className="text-white bg-slate-700 p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 lg:w-[28rem] sm:h-14"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
