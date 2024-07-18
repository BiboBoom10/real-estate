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
    </div>
  )
}

export default Profile