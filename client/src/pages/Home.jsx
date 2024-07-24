import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem';

function Home() {

  const [offerListing, setOfferListing] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(saleListings);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const response = await fetch('/api/listing/get-listings?offer=true&limit=4');
        const data = await response.json();
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/listing/get-listings?type=rent&limit=4');
        const data = await response.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const response = await fetch('/api/listing/get-listings?type=sale&limit=4')
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListing();
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-semibold text-3xl lg:text-6xl'>Find Your Dream Home Today with <br />
          <span className='text-slate-500'>Boom Estates</span>
        </h1>
        <div className="text-gray-500 text-xs sm:text-base">
          
          Welcome to HomeFinder, where your dream home is just a click away. 
          Whether you're looking to rent or buy, we offer a wide range of properties to suit every lifestyle and budget. 
          Discover your perfect home with us and experience the best in real estate.
          <Link to={'/search'} className='text-sm text-blue-800 font-semibold hover:underline'>
            Let's get started ...
          </Link>
          
        </div>
      </div>

      <Swiper navigation>
        {offerListing && offerListing.length > 0 && offerListing.map((listing) => (
          <SwiperSlide>
            <div className="h-[500px]" key={listing._id} style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}}></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListing.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
        )}
        {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-700'>Recent places for rent</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=rent'}>
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
        )}
        {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-700'>Recent places for sale</h2>
                <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=sale'}>
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
        )}
        
      </div>
      
    </div>
  )
}

export default Home