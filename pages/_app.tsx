import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton'
import Header from '../components/Layout/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar'
import useSWR, { SWRConfig } from 'swr'
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { msalInstance } from "../config/msal";
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [showChild, setShowChild] = useState(false)
    const token = getCookie('ACCESS_TOKEN')
	// console.log(param)
	// console.log(router.query)
	const clear = getCookie('CLEAR_SESSION_COOKIE')

	// useEffect(() => {
	// 	if(clear) {
	// 		window.sessionStorage.clear()
	// 		document.cookie.split(';').forEach(function(cookie) {
	// 			document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;');
	// 		});
	// 	}
	// }, [clear])

	useEffect(() => {
		if(clear === 'CLEAR') {
			window.sessionStorage.clear()
			document.cookie.split(';').forEach(function(cookie) {
				document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;');
			});
			deleteCookie('CLEAR_SESSION_COOKIE')
			// console.log("DUARRRRR CLEAR")
		}
		// console.log('ini clear ygy ')
		// console.log(clear)
	}, [clear])

    useEffect(() => {
        if(token == '' || token == undefined || token == null) {
			// deleteCookie('CLEAR_SESSION_COOKIE')
            // router.push('/')
        }
    }, [token])

    useEffect(() => {
        setShowChild(true)
    }, [])

    if (!showChild) {
        return null
    }

    function isValidPage() {
        return router.pathname !== '/' && router.pathname !== '/LoginAD' && router.pathname !== '/404'
    }

    return (
        // <SWRConfig value={{dedupingInterval: 1000}}>
        <MsalProvider instance={msalInstance}>
            <div className='font-mont bg-white text-secblack'>
                { isValidPage() && <Header /> }
                { isValidPage() && <Navbar /> }
                <Component {...pageProps} />
                { isValidPage() && <Footer /> }
            </div>
        </MsalProvider>
        // </SWRConfig>
    )
}

export default MyApp


