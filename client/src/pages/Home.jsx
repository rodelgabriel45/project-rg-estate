import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css/bundle";
import RecentListings from "../components/RecentListings";

export default function HomePage() {
  SwiperCore.use([Navigation]);
  SwiperCore.use([Pagination]);
  SwiperCore.use([Autoplay]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true&limit=4");
        const resData = await response.json();

        if (resData.success === false) {
          console.log(resData);
          return;
        }

        setOfferListings(resData);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=rent&limit=4");
        const resData = await response.json();

        if (resData.success === false) {
          console.log(resData);
          return;
        }

        setRentListings(resData);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=sale&limit=4");
        const resData = await response.json();

        if (resData.success === false) {
          console.log(resData);
          return;
        }

        setSaleListings(resData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-7 p-3 mx-auto mt-16 max-w-6xl">
        <h1 className="font-extrabold text-3xl lg:text-6xl text-slate-800">
          Discover Your Perfect <br />{" "}
          <span className="text-[#21B6A8]">Place</span> to Flourish
        </h1>

        <div>
          <p className="lg:text-xl">
            RG-Estate will help you find your home fast, easy and comfortable.
            <br /> Check out all the best property listings that we offer.
          </p>
        </div>
        <Link
          to={"/search"}
          className="text-blue-700 font-semibold hover:opacity-75"
        >
          Get Started now...
        </Link>
      </div>

      {/* swiper */}

      <Swiper
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {saleListings &&
          saleListings.length > 0 &&
          saleListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="mt-20 mb-20 h-[500px] lg:h-[550px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results */}

      <RecentListings listings={offerListings} text="offers" type="offer" />

      <RecentListings
        listings={saleListings}
        text="properties for sale"
        type="sale"
      />

      <RecentListings
        listings={rentListings}
        text="properties for rent"
        type="rent"
      />
    </div>
  );
}
