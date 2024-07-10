import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

function Profile() {

  // allow read,
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('images/.*')
  
  const {currentUser} = useSelector((state) => state.user); 

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files)} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mb-4' src={currentUser.avatar} alt="profile" />
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-70'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile