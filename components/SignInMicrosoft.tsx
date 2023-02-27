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

	useEffect(() => {
		if(microsoftIsAuthenticated == true){
			instance
			.acquireTokenSilent({
				...loginRequest,
				account: accounts[0],
			})
			.then((response) => {
				console.log('asd')
				callMsGraph(response.accessToken).then((response) => {
					setGraphData(response)
					fetch(process.env.BASE_URL+'/auth/login', {
						headers : { 
							"Content-Type" : "application/json" 
						},
						method: 'POST',
						body: JSON.stringify({
							email: accounts[0].username,
							role: window.localStorage.getItem('ROLE') == undefined ? 'STUDENT' : window.localStorage.getItem('ROLE')
						})
					}).then(
						res => res.json()
					).then((data) => {
						if(data.statusCode > 300) {
						} else {
							setCookie('ACCESS_TOKEN', data.access_token, {maxAge: 7200})
							setCookie('REFRESH_TOKEN', data.refresh_token, {maxAge: 86400*7})
							setCookie('ROLE', window.localStorage.getItem('ROLE') == undefined ? 'STUDENT' : window.localStorage.getItem('ROLE'), {maxAge: 86400*7})
							router.push('/home')
						}
					}).catch(() => {
					})
				});
			}).catch((err) => console.log(err))
        }
	}, [microsoftIsAuthenticated])

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