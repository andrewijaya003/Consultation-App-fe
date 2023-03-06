import { FaMicrosoft } from '@react-icons/all-files/fa/FaMicrosoft'
import React, { useEffect, useState } from 'react'
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { useRouter } from 'next/router';
import { callMsGraph } from '../config/graph';
import { setCookie } from 'cookies-next';

function SignInMicrosoft() {
    const { instance, accounts } = useMsal()
    const microsoftIsAuthenticated = useIsAuthenticated();
    const [graphData, setGraphData] = useState();
	const router = useRouter()

    const loginMicrosoft = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e)
        })
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