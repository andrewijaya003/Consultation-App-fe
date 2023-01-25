import { FaMicrosoft } from '@react-icons/all-files/fa/FaMicrosoft'
import React from 'react'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";

function SignInMicrosoft() {
    const { instance } = useMsal();

    const loginMicrosoft = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    }

    return (
        <div className='flex justify-center w-345 mb-10 py-3 rounded-md bg-blue text-center text-white font-bold hover:cursor-pointer ' onClick={() => loginMicrosoft()} >
            <FaMicrosoft size={25} />
            <div className='ml-2'>
                Login with microsoft
            </div>
        </div>  
    )
}

export default SignInMicrosoft