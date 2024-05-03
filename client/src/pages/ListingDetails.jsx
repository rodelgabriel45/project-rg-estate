import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";

import { numberFormatter } from "../utils/numberFormatter";

export default function ListingDetailsPage() {
  SwiperCore.use([Navigation]);
  const [listingDetails, setListingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const listingId = params.listingId;

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      const response = await fetch(`/api/listing/get/${listingId}`);

      const resData = await response.json();

      if (resData.success === false) {
        console.log(resData);
        setLoading(false);
        return;
      }

      setLoading(false);
      setListingDetails(resData);
    };

    fetchListingDetails();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-center my-10 text-2xl font-bold">
          Loading listing details...
        </p>
      )}
      {listingDetails && !loading && (
        <>
          <Swiper navigation>
            {listingDetails?.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px] lg:h-[700px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col justify-center items-center mb-20">
            <div className="mt-10 space-y-4">
              <h2 className="font-bold text-2xl">
                {listingDetails.name} -{" "}
                {listingDetails.discountedPrice
                  ? numberFormatter.format(listingDetails.discountedPrice)
                  : numberFormatter.format(listingDetails.regularPrice)}
                {listingDetails.type === "rent" && "/ month"}
              </h2>
              <div className="flex items-center gap-2 mt-5 text-start text-md">
                <FaMapMarkerAlt className="text-green-500" />
                <p>{listingDetails.address}</p>
              </div>
              <div className="flex">
                <button className="bg-red-700 px-4 py-2 rounded-md text-white">
                  {listingDetails.type === "sale" ? "For Sale" : "For Rent"}
                </button>
                {listingDetails.offer && (
                  <button className="bg-green-500 px-4 py-2 rounded-md text-white">
                    {numberFormatter.format(listingDetails.discountedPrice)}{" "}
                    discount
                  </button>
                )}
              </div>
              <p>{listingDetails.description}</p>
              <div className="flex gap-5 font-semibold text-sm md:text-lg md:gap-7">
                <div className="flex items-center gap-2">
                  <FaBed className="text-green-700" />
                  {listingDetails.bedrooms} bed
                  {listingDetails.bedrooms > 1 && "s"}
                </div>

                <div className="flex items-center gap-2">
                  <FaBath className="text-green-700" />
                  {listingDetails.bathrooms} bath
                  {listingDetails.bathrooms > 1 && "s"}
                </div>

                <div className="flex items-center gap-2">
                  <FaParking className="text-green-700" />
                  {listingDetails.parking ? "Parking Available" : "No Parking"}
                </div>

                <div className="flex items-center gap-2">
                  <FaChair className="text-green-700" />
                  {listingDetails.furnished ? "Furnished" : "Not Furnished"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
