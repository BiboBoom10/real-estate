import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUsereStart, deleteUserSuccess, deleteUserFailure, signOutUsereStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { Link, json } from 'react-router-dom';

function Profile() {

  // allow read,
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('images/.*')
  
  const {currentUser, loading, error} = useSelector((state) => state.user); 

  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  // console.log(formData);

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
        // console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setFileUploadError(true);
        console.log('Upload error', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => {
          return setFormData({...formData, avatar: downloadURL})
        })
      })
  }

  const handleChange = (event) => {
    setFormData({...formData, [event.target.id]: event.target.value});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if(data.success === false) {
        dispatch(updateUserFailure(error.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUsereStart());

      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json();

      if(data.success === false) {
        dispatch(deleteUserFailure(data.message)); 
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUsereStart());
      const response = await fetch('/api/auth/signout');
      const data = await response.json();

      if(data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }

      dispatch(signOutUserSuccess(data));

    } catch (error) {
      dispatch(signOutUserFailure());
      console.log(error);
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const response = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await response.json();

      if(data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      })

      const data = await response.json();

      if(data.success === false) {
        console.log(error.message);
        return;
      }

      setUserListings((previousListing) => previousListing.filter((listing) => listing._id !== listingId))

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mb-4' src={formData.avatar || currentUser.avatar} alt="profile" />
        {fileUploadError ? (
          <span className='text-red-500 text-center'>Failed to upload image(Image must be less than 2MB)</span>
        ) : filePercentage > 0 && filePercentage < 100 ? (
          <span className='text-slate-700 text-center'>{`Uploading ${filePercentage}%`}</span>
        ) : filePercentage === 100 ? (
          <span className='text-green-500 text-center'>Image uploaded successfully</span>
        ) : ''
        }
        <input type="text" placeholder='username' defaultValue={currentUser.username} onChange={handleChange} id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' defaultValue={currentUser.email} onChange={handleChange} id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' onChange={handleChange} id='password' className='border p-3 rounded-lg' />
        <button disabled={loading} type='submit'  className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-70'>{loading? 'Loading...': 'Update'}</button>
        <Link className='bg-green-700 text-white text-center rounded-lg p-3 hover:opacity-90 disabled:opacity-70' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-500 mt-5'>{error ? error : ''}</p>
      <p className='text-green-500 text-center'>{updateSuccess ? 'User updated successfully': ''}</p>
      <button onClick={handleShowListings} className='w-full text-green-700'>
        Show Listings
      </button>
      <p className='text-red-500 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>

      {userListings && userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-2xl font-semibold text-center my-5'>Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="flex items-center justify-between border border-gray-300 p-3 rounded-lg gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="image cover" className='h-28 w-28 object-contain' />
              </Link>
              <Link className='font-semibold truncate hover:cursor-pointer flex-1' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col gap-2">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700'>Edit</button>
                </Link>
                <button onClick={() => handleDeleteListing(listing._id)} className='text-red-500'>Delete</button>
              </div>
            </div>
          ))}
        </div>}

    </div>
  )
}

export default Profile