import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData(
      {
        ...formData,
        [event.target.id]: event.target.value
      }
    )
    console.log(formData);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='User Name' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg bg-slate-700 text-white p-3 rounded-lg uppercase hover: opacity-95 disabled:opacity-80'>
          {loading ? 'Loading' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex flex-row gap-2 mt-5 justify-center'>
        <p>Have an account?</p>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignUp