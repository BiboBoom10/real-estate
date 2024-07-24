import React from 'react'
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md overflow-hidden rounded-lg w-full sm:w-[15rem]'>
        {/* hover:shadow-lg transition-shadow */}
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="cover-image" className='h-[12rem] w-full object-cover hover:scale-105 transition-scale duration-500' />
            <div className="p-3 flex flex-col gap-2 w-full">
                <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
                <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className='text-green-700 h-4 w-4' />
                    <p className='text-gray-500 text-sm truncate w-full'>{listing.address}</p>
                </div>
                <p className='text-slate-500 text-justify line-clamp-3 text-sm'>{listing.description}</p>

                <div className="flex gap-2">
                    <div className="text-gray-500 font-semibold text-sm">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed` }
                    </div>
                    <div className="text-gray-500 font-semibold text-sm">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom` }
                    </div>
                </div>

                <p className='text-black font-semibold text-sm mt-2'>
                    Ksh.{' '}
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                </p>
            </div>
        </Link>
    </div>
  )
}

export default ListingItem;