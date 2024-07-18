import React from 'react'

function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder='Name' id='name' className='border p-3 rounded-lg' maxLength={64} minLength={10} required />
          <textarea type="text" placeholder='Description' id='description' className='border p-3 rounded-lg' required />
          <input type="text" placeholder='Address' id='address' className='border p-3 rounded-lg' required />

          <div className="flex gap-6 flex-wrap">

            <div className="flex gap-2">
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type='checkbox' id='parking' className='w-5' />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id='offer' className='w-5' />
              <span>Offer</span>
            </div>

          </div>

          <div className="flex flex-wrap gap-6">

            <div className="flex gap-2 items-center">
              <input type='number' id='bedrooms' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <p>Bed</p>
            </div>

            <div className="flex gap-2 items-center">
              <input type='number' id='bathrooms' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <p>Baths</p>
            </div>

            <div className="flex gap-2 items-center">
              <input type='number' id='regularPrice' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className='text-xs'>(Ksh / month)</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input type='number' id='discountPrice' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className='text-xs'>(Ksh / month)</span>
              </div>
            </div>

          </div>

        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images: 
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max: 6)</span>
          </p>

          <div className="flex gap-4">
            <input type="file" id="images" accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
            <button className='p-3 text-white bg-green-700 hover:opacity-90 disabled:opacity-70 rounded'>Upload</button>
          </div>
        <button className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-70'>Create Listing</button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing