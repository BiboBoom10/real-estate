import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Search() {

	const navigate = useNavigate();

	const [sideBarData, setSideBarData] = useState({
		searchTerm: '',
		type: 'all',
		parking: false,
		furnished: false,
		offer: false,
		sort: 'createdAt',
		order: 'desc'
	});
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState([]);
	console.log(listings);

	useEffect(() =>{
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		const typeFromUrl = urlParams.get('type');
		const parkingFromUrl = urlParams.get('parking');
		const furnishedFromUrl = urlParams.get('furnished');
		const offerFromUrl = urlParams.get('offer');
		const sortFromUrl = urlParams.get('sort');
		const orderFromUrl = urlParams.get('order');

		if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
			setSideBarData({
				searchTerm: searchTermFromUrl || '',
				type: typeFromUrl || 'all',
				parking: parkingFromUrl === 'true' ? true : false,
				furnished: furnishedFromUrl === 'true' ? true : false,
				offer: offerFromUrl === 'true' ? true : false,
				sort: sortFromUrl || 'createdAt',
				order: orderFromUrl || 'desc'
			})
		}

		const fetchListings = async () => {
			setLoading(true);
			try {
				const searchQuery = urlParams.toString();
				const response = await fetch(`/api/listing/get-listings?${searchQuery}`);

				const data = await response.json();
				setListings(data);
				setLoading(false)
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		}

		fetchListings();

	}, [location.search])

	const handleChange = (event) => {
		if(event.target.id === 'all' || event.target.id === 'rent' || event.target.id === 'sale') {
			setSideBarData({...sideBarData, type: event.target.id});
		}

		if(event.target.id === 'searchTerm') {
			setSideBarData({...sideBarData, searchTerm: event.target.value});
		}

		if(event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer') {
			setSideBarData({...sideBarData, [event.target.id] : event.target.checked || event.target.checked === 'true' ? true : false})
		}

		if (event.target.id === 'sort_order') {
			const sort = event.target.value.split('_')[0] || 'createdAt';
			const order = event.target.value.split('_')[1] || 'desc';

			setSideBarData({...sideBarData, sort, order })
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		const urlParams = new URLSearchParams();
		urlParams.set('searchTerm', sideBarData.searchTerm);
		urlParams.set('type', sideBarData.type);
		urlParams.set('parking', sideBarData.parking);
		urlParams.set('furnished', sideBarData.furnished);
		urlParams.set('offer', sideBarData.offer);
		urlParams.set('sort', sideBarData.sort);
		urlParams.set('order', sideBarData.order);

		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`)
	}

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className="flex items-center gap-2">
            <label className='whitespace-nowrap'>Search Term:</label>
            <input value={sideBarData.searchTerm} onChange={handleChange} type="text" id="searchTerm" placeholder='Search ...' className='border p-3 rounded-lg w-full' />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <label>Type: </label>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="all" 
			  	onChange={handleChange}
				checked={sideBarData.type === 'all'}
			  />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="rent"
			  	onChange={handleChange}
				checked={sideBarData.type === 'rent'}
			  />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="sale" 
			  	onChange={handleChange}
				checked={sideBarData.type === 'sale'}
			  />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="offer" 
			  	onChange={handleChange}
				checked={sideBarData.offer}
			  />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <label>Amenities: </label>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="parking" 
			  	onChange={handleChange}
				checked={setSideBarData.parking}
			  />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="furnished" 
			  	onChange={handleChange}
				checked={sideBarData.furnished}
			  />
              <span>Furnished</span>
            </div>
          </div>
          
			<div className="flex items-center gap-2">
				<label>Sort: </label>
				<select id="sort_order" className='border p-3 rounded-lg'
					onChange={handleChange} defaultValue={'created_at_desc'}
				>
					<option value='regularPrice_desc'>Price High to Low</option>
					<option value='regularPrice_asc'>Price Low to High</option>
					<option value='createdAt_desc'>Latest</option>
					<option value='createdAt_asc'>Oldest</option>
				</select>
			</div>

			<button className='p-3 text-white rounded-lg bg-slate-700 hover:opacity-90'>Search</button>

        </form>
      </div>
      <div className="">
        <h1 className='text-slate-700 font-semibold mt-5 p-3 border-b-2 text-3xl'>Listing Results</h1>
      </div>
    </div>
  )
}

export default Search