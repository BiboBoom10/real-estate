import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Contact from '../components/Contact';

function Listing() {

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const {currentUser} = useSelector((state) => state.user);

  const params = useParams();

  SwiperCore.use([Navigation]);

  useEffect(() => {
      const fetchListing = async () => {
          try {
            setLoading(true);
            const response = await fetch(`/api/listing/get-listing/${params.listingId}`);
            const data = await response.json();
    
            if(data.success === false) {
              setError(true);
              setLoading(false);
              return
            }
            setListing(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
      } 
      fetchListing();
  }, [params.listingId])

  return (
    <main>
      {loading && <p className='text-center mt-5'>Loading...</p>}
      {error && <p className='text-center mt-5 text-red-500'>Something went wrong</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
              {listing.imageUrls.map(url => 
                <SwiperSlide key={url}>
                    <div className='h-[40vh]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                </SwiperSlide>  
              )}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare 
                  className='text-slate-500'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false)
                    }, 2000)
                  }}
                />
          </div>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='font-semibold text-2xl'>
              {listing.name} - Ksh.{' '}
              {listing.offer ? listing.discountPrice.toLocaleString('en-US'): listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-500 w-full max-w-[200px] text-white text-center rounded-md p-1'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-700 w-full max-w-[200px] text-white text-center rounded-md p-1' ><span className='font-semibold'>Discount:</span> Ksh. {+listing.regularPrice - +listing.discountPrice}</p>
              )}
            </div>
            <p className='text-slate-700 text-justify'>
              <span className='font-semibold text-black'>
                  Description - {' '}
              </span>
              {listing.description}
            </p>

            <ul className='flex items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-2 whitespace-nowrap text-black font-semibold text-sm'><FaBed className='text-lg text-slate-600' />{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</li>
              <li className='flex items-center gap-2 whitespace-nowrap text-black font-semibold text-sm'><FaBath className='text-lg text-slate-600' />{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</li>
              <li className='flex items-center gap-2 whitespace-nowrap text-black font-semibold text-sm'><FaParking className='text-lg text-slate-600' />{listing.parking ? 'Parking Spot' : 'No Parking'}</li>
              <li className='flex items-center gap-2 whitespace-nowrap text-black font-semibold text-sm'><FaChair className='text-lg text-slate-600' />{listing.furnished ? 'Furnished' : 'Not Furnished'}</li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className='p-3 bg-slate-700 rounded-lg hover:opacity-90 text-white'>Contact Landlord</button>
            )}

            {contact && <Contact listing={listing} />}

          </div>

        </div>

      )}
    </main>
  )
}

export default Listing