import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const usingGoogleHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })
            const data = await response.json();
            dispatch(signInSuccess(data));
            navigate('/');
            
        } catch (error) {
            console.log('Could not login', error);
        }
    }

    return (
        <button onClick={usingGoogleHandler} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Continue with Google</button>
    )
    }

export default OAuth