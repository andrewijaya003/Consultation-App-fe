import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton'
import Header from '../components/Layout/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar'
import { SWRConfig } from 'swr'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../config/msal";
import { getCookie } from 'cookies-next'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [showChild, setShowChild] = useState(false)
    const token = getCookie('ACCESS_TOKEN')

    useEffect(() => {
        if(token == '' || token == undefined || token == null) {
            router.push('/')
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


