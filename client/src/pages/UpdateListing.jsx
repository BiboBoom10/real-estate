import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateListing() {

  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      console.log(listingId);

      const response = await fetch(`/api/listing/get-listing/${listingId}`)

      const data = await response.json();
      setFormData(data);

      if(data.success === false) {
        console.log(data.message);
        return;
      }
    }
    fetchListing();
  }, [])

  console.log(formData);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject(error);
      },
      () => getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      })
      );
    })
  }
  
  const handleImageSubmit = () => {
    if(files.length > 0 && (files.length + formData.imageUrls.length) < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for(let i=0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUploading(false);
      }).catch((error) => {
        setImageUploadError('Image upload error: (2mb max per image)');
        setUploading(false);
      })
    } else {
      setImageUploadError('You can only upload 6 images');
      setUploading(false);
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index), })
  }

  const handleChange = (event) => {
    if(event.target.id === 'sale' || event.target.id === 'rent'){
      setFormData({...formData, type: event.target.id});
    }

    if(event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer') {
      setFormData({
        ...formData,
        [event.target.id] : event.target.checked
      })
    }

    if(event.target.type === 'text' || event.target.type === 'number' || event.target.type === 'textarea') {
      setFormData({
        ...formData,
        [event.target.id] : event.target.value
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      if(formData.imageUrls.length < 1) {
        return setError('You must upload at least 1 image')
      }

      if(+formData.regularPrice < +formData.discountPrice) {
        return setError('Discount price must be less than regular price')
      }

      setLoading(true);
      setError(false);

      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })
      console.log('currentUser:', currentUser);

      const data = await response.json();
      setLoading(false);

      if(data.success === false) {
        setError(data.message)
      }

      navigate(`/listing/${data._id}`);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className="flex flex-col gap-4 flex-1">
          <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' id='name' className='border p-3 rounded-lg' maxLength={64} minLength={10} required />
          <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' id='description' className='border p-3 rounded-lg' required />
          <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' id='address' className='border p-3 rounded-lg' required />

          <div className="flex gap-6 flex-wrap">

            <div className="flex gap-2">
              <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>

          </div>

          <div className="flex flex-wrap gap-6">

            <div className="flex gap-2 items-center">
              <input onChange={handleChange} value={formData.bedrooms} type='number' id='bedrooms' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <p>Bed</p>
            </div>

            <div className="flex gap-2 items-center">
              <input onChange={handleChange} value={formData.bathrooms} type='number' id='bathrooms' max={10} min={1} required className='p-2 border-gray-300 rounded-lg'  />
              <p>Baths</p>
            </div>

            <div className="flex gap-2 items-center">
              <input onChange={handleChange} value={formData.regularPrice} type='number' id='regularPrice' max={10000000} min={5000} required className='p-2 border-gray-300 rounded-lg'  />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className='text-xs'>(Ksh / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input onChange={handleChange} value={formData.discountPrice} type='number' id='discountPrice' max={10000000} min={0} required className='p-2 border-gray-300 rounded-lg'  />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className='text-xs'>(Ksh / month)</span>
                </div>
              </div>
            )}

          </div>

        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images: 
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max: 6)</span>
          </p>

          <div className="flex gap-4">
            <input onChange={(e) => setFiles(Array.from(e.target.files))} type="file" id="images" accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
            <button disabled={uploading} onClick={handleImageSubmit} type='button' className='p-3 text-white bg-green-700 hover:opacity-90 disabled:opacity-70 rounded'>
              {uploading ? 'Uploading ...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-500 text-center'>{imageUploadError && imageUploadError}</p>

          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between border border-gray-300 p-3 rounded-lg">
                <img src={url} alt="listing-image" className='w-20 h-20 object-cover rounded-lg' />
                <button type='button' onClick={() => handleRemoveImage(index)} className='text-red-500 hover:opacity-70'>Delete</button>
              </div>
            ))
          }

          <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-70'>{loading ? 'Updating ...' : 'Update Listing'}</button>
          {error && <p className='text-red-500 text-center'>{error  }</p>}

        </div>
        
      </form>
    </main>
  )
}

export default UpdateListing;