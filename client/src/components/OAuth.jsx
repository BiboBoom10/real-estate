import React from 'react'

function OAuth() {

    const usingGoogleHandler = async () => {
        try {
            
        } catch (error) {
            console.log('Could not login', error);
        }
    }

    return (
        <button onClick={usingGoogleHandler} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Continue with Google</button>
    )
    }

export default OAuth