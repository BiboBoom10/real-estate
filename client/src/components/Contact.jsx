import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Contact({listing}) {

  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
    try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        setLandlord(data)
      
    } catch (error) {
      console.log(error);
    }
  }
    fetchLandlord();

  }, [listing.userRef])

  const handleMessage = (event) => {
    setMessage(event.target.value);
  }

  return (
    <>
    {landlord && (
      <div className="flex flex-col gap-2">
        <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name}</span></p>
        <textarea className='w-full p-3 rounded-lg border' placeholder='Enter your message here ...' name="message" id="message" value={message} onChange={handleMessage} rows="2"></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}& body=${message}`} className='bg-slate-700 text-center p-3 rounded-lg text-white hover:opacity-90'>
          Send Message
        </Link>
      </div>
    )}
    </>
  )
}

export default Contact